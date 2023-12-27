"use client";
import { Button, Card, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { abi } from "./abi";
import { Contract, Web3 } from "web3";
import {
  CONTRACT_ADDRESS,
  ROC_ENDPOINT,
  Staff,
  addUser,
  getUser,
  getUsersCount,
} from "./contract";
import { useRouter } from "next/navigation";
interface UserInfo {
  username: string | undefined;
  password: string | undefined;
}

export default function Home() {
  const web3 = new Web3(ROC_ENDPOINT);
  const contract = new Contract(abi, CONTRACT_ADDRESS, web3);

  const router = useRouter();
  const [user, setUser] = useState<UserInfo>();
  const [staffs, SetStaff] = useState<Staff[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    console.log(staffs);
  });

  const fetchData = async () => {
    const amount = await getUsersCount(contract);
    const listStaff = [...staffs];
    for (let index = 0; index < amount; index++) {
      const staffInfo = await getUser(contract, index);
      listStaff.push(staffInfo);
    }
    SetStaff(listStaff);
  };

  return (
    <>
      <div>
        <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          display={"flex"}
          height={"100vh"}
        >
          <Card
            sx={{
              height: 400,
              width: 400,
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
            <form className="form">
              <TextField
                label="Username"
                id="username"
                fullWidth
                onChange={(e: any) => {
                  setUser({
                    password: user?.password,
                    username: e.target.value,
                  });
                }}
                type="text"
              />
              <TextField
                label="Password"
                id="password"
                fullWidth
                onChange={(e: any) => {
                  setUser({
                    username: user?.username,
                    password: e.target.value,
                  });
                }}
                type="password"
              />

              <Button
                variant="contained"
                onClick={() => {
                  if (user?.username === "admin") {
                    router.push("/staff");
                  } else {
                    const index = staffs.findIndex(
                      (value) => value.name === user?.username
                    );
                    if (index !== -1) {
                      router.push(`/info?index=${index}`);
                    }
                  }
                }}
              >
                Log in
              </Button>
            </form>
          </Card>
        </Grid>
      </div>
    </>
  );
}
