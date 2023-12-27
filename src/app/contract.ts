export interface Staff {
  id: number;
  name: string;
  image: string;
  salary: number;
}

export const ROC_ENDPOINT = "http://127.0.0.1:8545";
export const CONTRACT_ADDRESS = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";
export const DEFAULT_ACCOUNT = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";

export async function addUser(
  contract: any,
  id: number,
  name: string,
  image: string,
  salary: number
) {
  const data = await contract.methods
    .addUser(id, name, image, salary)
    .send({ from: DEFAULT_ACCOUNT });
}

export async function getUser(contract: any, index: number) {
  const data = await contract.methods.getUser(index).call();

  const info: Staff = {
    id: Number(data[0]),
    name: data[1],
    image: data[2],
    salary: Number(data[3]),
  };
  return info;
}

export async function getUsersCount(contract: any) {
  const data = await contract.methods.getUsersCount().call();
  const count = Number(data);
  return count;
}
