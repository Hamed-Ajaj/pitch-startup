export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-06-05";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing environment variable: NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID",
);

export const token = assertValue(
  "skwpQyC6fNT0TZcV5pIMiW9XW74pxcsCR6V7RyqblYkzFKFOqsqqxmpumgeWICmyLJbB3K2wMqWZ7NYGAv3mebsr3OvWbVLT21GerulpHrmD3vbWndlSIa3pZAMLRxVxJJTeezUTMeeOi3BtDnsrceXCTWBd8Ur9Rlr1i16xLN8vggiAos2w",
  "Missing environment variable: SANITY_WRITE_TOKEN",
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
