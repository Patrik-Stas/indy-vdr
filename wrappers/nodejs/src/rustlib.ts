import * as ref from 'ref-napi';
// import * as StructType from 'ref-struct-di';

import { VDRRuntime } from './vdr';

interface IUintTypes {
    [key: string]: string;
}
const UINTS_TYPES: IUintTypes = { x86: 'uint32', x64: 'uint64' };
const ARCHITECTURE: string = process.env.INDY_VDR_FFI_ARCHITECTURE || 'x64';
const FFI_USIZE: string = UINTS_TYPES[ARCHITECTURE];

// FFI Type Strings
export const FFI_CALLBACK_ID = 'int';
export const FFI_ERROR_CODE = 'int';
export const FFI_BOOL = 'bool';
export const FFI_HANDLE = 'uint32';
export const FFI_REQUEST_HANDLE = 'uint32';
export const FFI_UNSIGNED_INT = 'uint32';
export const FFI_UNSIGNED_LONG = 'uint64';
export const FFI_UNSIGNED_INT_PTR = FFI_USIZE;
export const FFI_STRING = 'string';
export const FFI_CONFIG_PATH = FFI_STRING;
export const FFI_STRING_DATA = 'string';
export const FFI_SOURCE_ID = 'string';
export const FFI_VOID = ref.types.void;
export const FFI_USIZE_PTR = ref.refType(FFI_HANDLE);
export const FFI_CALLBACK_PTR = 'pointer';

// Rust Lib Native Types
export type rust_string = string;
export type rust_err_code = number;
export type rust_command_handle = number;
export type rust_object_handle = number;
export type rust_pool_handle = rust_object_handle;

export interface IFFIEntryPoint {
    indy_vdr_version: () => rust_string;
    indy_vdr_set_config: (config: rust_string) => rust_err_code;
    indy_vdr_set_default_logger: () => rust_err_code;
    // pool
    indy_vdr_pool_create: (params: rust_string, pool_handle: Buffer) => rust_err_code;
    indy_vdr_pool_close: (poolHandle: number) => rust_err_code;
    indy_vdr_build_custom_request: (requestJson: string, requestHandle: Buffer) => rust_err_code;
    indy_vdr_request_get_body: (requestHandle: number, bodyReturnPtr: number) => rust_err_code; // fix this signature
    indy_vdr_pool_submit_request: (poolHandle: number, requestHandle: number, cb: any, cbId: number) => rust_err_code;
}

/**
 * @class Class containing indyVDR FFI API functions
 */
export const FFIConfiguration: { [Key in keyof IFFIEntryPoint]: any } = {
    // first element is method return type, second element is list of method argument types
    indy_vdr_version: [FFI_STRING, []],
    indy_vdr_set_config: [FFI_ERROR_CODE, [FFI_STRING_DATA]],
    indy_vdr_set_default_logger: [FFI_ERROR_CODE, []],
    indy_vdr_build_custom_request: [FFI_ERROR_CODE, [FFI_STRING_DATA, FFI_USIZE_PTR]],
    indy_vdr_request_get_body: [FFI_ERROR_CODE, [FFI_USIZE, FFI_USIZE]],
    // pool
    indy_vdr_pool_create: [FFI_ERROR_CODE, [FFI_STRING_DATA, FFI_USIZE_PTR]],
    indy_vdr_pool_close: [FFI_ERROR_CODE, [FFI_USIZE_PTR]],
    indy_vdr_pool_submit_request: [FFI_ERROR_CODE, [FFI_USIZE, FFI_USIZE, FFI_CALLBACK_PTR, FFI_USIZE]],
};

let _rustAPI: IFFIEntryPoint;
export const initRustAPI = (path?: string) => (_rustAPI = new VDRRuntime({ basepath: path }).ffi);
export const rustAPI = () => _rustAPI;