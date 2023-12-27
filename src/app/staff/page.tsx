"use client";
import {
  CONTRACT_ADDRESS,
  ROC_ENDPOINT,
  Staff,
  addUser,
  getUser,
  getUsersCount,
} from "../contract";
import { FormEvent, useEffect, useState } from "react";
import { Contract, Web3 } from "web3";
import { abi } from "../abi";
import {
  Button,
  Input,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";

export const IPFS_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4MmFhMWMxOS1iMGJiLTQ4ZWUtOWZmOC1hOWM3MTYyZWQyMzUiLCJlbWFpbCI6ImhpZW5jaGFtaG9jQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI5Yjc2YWJhMjYzNjk4ZDA1OTg1NSIsInNjb3BlZEtleVNlY3JldCI6ImVhMzBmNGUzMzc0YmYyZmY0ZjEwMzg5NmYxYmRjMDNkODVlNDgxMWY1Y2EwZjdkMTZlNWI2ZDYzODhiMTI4MjciLCJpYXQiOjE3MDM2ODA0NDl9.JUknRLJH5COZCc3m7B9lKz4XBxoLTTdivojy6MmgWkY";

export default function Page() {
  const web3 = new Web3(ROC_ENDPOINT);
  const contract = new Contract(abi, CONTRACT_ADDRESS, web3);
  const [staffs, SetStaff] = useState<Staff[]>([]);
  const [form, setForm] = useState<Staff>();

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log(form);
  });
  const fetchData = async () => {
    const amount = await getUsersCount(contract);
    const listStaff: Staff[] = [];
    for (let index = 0; index < amount; index++) {
      const staffInfo = await getUser(contract, index);
      listStaff.push(staffInfo);
    }
    SetStaff(listStaff);
  };

  async function handleSubmit() {
    if (!form?.id || !form.name || !form.image || !form.salary) {
      console.log("sai");
    } else {
      console.log("dung");

      await addUser(
        contract,
        form?.id,
        form?.name,
        form?.image,
        form?.salary
      ).then(() => {
        fetchData();
      });
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="right">Image</TableCell>
              <TableCell align="right">Salary</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staffs.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">
                  <Image
                    src={
                      "https://tomato-realistic-barracuda-539.mypinata.cloud/ipfs/" +
                      `${row.image}`
                    }
                    width={50}
                    height={50}
                    alt="image"
                  />
                </TableCell>
                <TableCell align="right">{row.salary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <form>
        <Button variant="contained" onClick={handleSubmit}>
          Add user
        </Button>
        <InputLabel>id</InputLabel>
        <TextField
          id="id"
          value={form?.id}
          onChange={(e: any) => {
            setForm((prevState: any) => {
              return { ...prevState, id: e.target.value };
            });
          }}
        />
        <InputLabel>name</InputLabel>
        <TextField
          id="name"
          value={form?.name}
          onChange={(e: any) => {
            setForm((prevState: any) => {
              return { ...prevState, name: e.target.value };
            });
          }}
        />
        <InputLabel>Image</InputLabel>

        <Button variant="contained" component="label">
          Upload File
          <input
            type="file"
            hidden
            onChange={async (e) => {
              let bodyFormData = new FormData();
              bodyFormData.append("file", (e as any).target.files.item(0));
              try {
                return await axios
                  .post(
                    `https://api.pinata.cloud/pinning/pinFileToIPFS`,
                    bodyFormData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${IPFS_JWT}`,
                      },
                    }
                  )
                  .then((res) => {
                    if (res.status === 200) {
                      setForm((prevState: any) => {
                        return { ...prevState, image: res.data.IpfsHash };
                      });
                    }
                  });
              } catch (e) {
                console.log(e);
              }
            }}
          />
        </Button>
        <InputLabel>salary</InputLabel>
        <TextField
          id="salary"
          value={form?.salary}
          onChange={(e: any) => {
            setForm((prevState: any) => {
              return { ...prevState, salary: e.target.value };
            });
          }}
        />
      </form>
    </>
  );
}
