"use client";
import { useSearchParams } from "next/navigation";
import { CONTRACT_ADDRESS, ROC_ENDPOINT, Staff, getUser } from "../contract";
import { useEffect, useState } from "react";
import { Contract, Web3 } from "web3";
import { abi } from "../abi";

export default function Page() {
  const web3 = new Web3(ROC_ENDPOINT);
  const contract = new Contract(abi, CONTRACT_ADDRESS, web3);
  const searchParams = useSearchParams();
  const index = searchParams.get("index");
  const [staff, setStaff] = useState<Staff>();

  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    const data = await getUser(contract, index as any);
    console.log(data);

    setStaff(data);
  };
  return <>info</>;
}
