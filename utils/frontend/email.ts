export function generateCorporateLikeEmail(): string {
  const random = Math.floor(Math.random() * 100000);
  return `mateus${random}@examplecorp.com`;
}
