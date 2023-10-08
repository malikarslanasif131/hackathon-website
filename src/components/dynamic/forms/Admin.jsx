"use client";

import { useState } from "react";
import Form from "@/components/dynamic/forms/Form.jsx";
import { FIELDS, HELPER } from "../../../data/dynamic/forms/Admins";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

const Admin = () => {
  const { data: session } = useSession();
  const [admin, setAdmin] = useState({
    ...HELPER,
    name: session.user.name,
    email: session.user.email,
  });

  const handleSubmit = (setLoading) => {
    axios
      .post("/api/admins", admin)
      .then(() => {
        setLoading(false);
        toast(`✅ Submitted successfully!`);
      })
      .catch(() => {
        setLoading(false);
        toast(`❌ Internal Server Error`);
      });
  };
  return (
    <Form
      fields={FIELDS}
      object={admin}
      setObject={setAdmin}
      header="ADMIN PORTAL REQUEST"
      onSubmit={handleSubmit}
    />
  );
};

export default Admin;
