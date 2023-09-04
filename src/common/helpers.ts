export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return (
    "0x" +
    Array.from(uint8Array, (byte) => byte.toString(16).padStart(2, "0")).join(
      ""
    )
  );
}

export function toEntityMap<E extends { addressHex: string }>(
  entities: E[]
): Map<string, E> {
  return new Map(entities.map((e) => [e.addressHex, e]));
}

export function toEntityMapTx<E extends { id: string }>(
  entities: E[]
): Map<string, E> {
  return new Map(entities.map((e) => [e.id, e]));
}
