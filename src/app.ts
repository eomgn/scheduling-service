import express from "express";
import { z } from "zod";
import { supabase } from "@/supabase-connect";

const app = express();
app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const { data: users } = await supabase.from("/users").select("*");

    return res.json(users);
  } catch (error) {
    console.log(error);
  }
});

app.post("/users", async (req, res) => {
  try {
    const bodySchema = z.object({
      name: z.string(),
      email: z.email(),
    });

    const { name, email } = bodySchema.parse(req.body);

    const { data: user } = await supabase
      .from("/users")
      .insert([{ name, email }])
      .select();

    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  await supabase.from("users").delete().eq("id", id);

  return res.status(200).json();
});

export { app };
