import { deflateRaw, inflateRaw } from "pako"

export type JsonValue =
  null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

const returnPrefix = /^return /
const stringKeys = /\["(.*?)"\]=/g
const numberKeys = /\[(\d+)\]=/g
const trailingCommas = /,}/g
const numberKey = /"NOSTRING_(\d+)":/g
const stringKey = /"([^"]*?)":/g

function isRecord(value: JsonValue): value is { [key: string]: JsonValue } {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export function decompress(data: Uint8Array) {
  return inflateRaw(data, { toText: true })
}

export function compress(data: string) {
  return deflateRaw(data)
}

export function rawToJSON(data: string): JsonValue {
  return JSON.parse(
    data
      .replace(returnPrefix, "")
      .replace(stringKeys, '"$1":')
      .replace(numberKeys, '"NOSTRING_$1":')
      .replace(trailingCommas, "}")
  ) as JsonValue
}

export function fixJSONArrays(json: JsonValue): JsonValue {
  if (!isRecord(json)) {
    return json
  }

  const keys = Object.keys(json)
  if (keys.length === 0) {
    return json
  }

  if (!keys.every((key) => key.startsWith("NOSTRING_"))) {
    for (const key of keys) {
      json[key] = fixJSONArrays(json[key])
    }
    return json
  }

  const array: JsonValue[] = []
  for (const key of keys) {
    array[Number.parseInt(key.slice(9), 10) - 1] = fixJSONArrays(json[key])
  }

  return array
}

export function fixLuaArrays(json: JsonValue): JsonValue {
  if (Array.isArray(json)) {
    const record: { [key: string]: JsonValue } = {}
    for (let index = 0; index < json.length; index += 1) {
      record[`NOSTRING_${index + 1}`] = fixLuaArrays(json[index])
    }
    return record
  }

  if (isRecord(json)) {
    for (const key of Object.keys(json)) {
      json[key] = fixLuaArrays(json[key])
    }
  }

  return json
}

export function JSONToRaw(data: JsonValue) {
  return `return ${JSON.stringify(data)
    .replace(numberKey, "[$1]=")
    .replace(stringKey, '["$1"]=')}`
}

export function processFile(buffer: Uint8Array) {
  const data = decompress(buffer)
  const json = rawToJSON(data)

  if (isRecord(json) && isRecord(json.GRAPHICS)) {
    json.GRAPHICS.shadows = json.GRAPHICS.shadows === "On"
  }

  return fixJSONArrays(json)
}

export function processJSON(json: JsonValue) {
  const data = fixLuaArrays(json)

  if (isRecord(data) && isRecord(data.GRAPHICS)) {
    data.GRAPHICS.shadows = data.GRAPHICS.shadows ? "On" : "Off"
  }

  return compress(JSONToRaw(data))
}
