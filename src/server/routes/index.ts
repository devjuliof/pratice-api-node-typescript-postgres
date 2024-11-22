import { Request, Response, Router } from "express";
import { client } from "../server";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Verificar se os dados foram enviados
  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    // Buscar o usuário no banco
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado." });
    }

    const user = result.rows[0];

    // Verificar a senha
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta." });
    }

    // Se tudo der certo, retornar um sucesso
    return res.status(200).json({ message: "Login bem-sucedido!" });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ message: "Erro no servidor." });
  }
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      return res.status(400).json({ message: "Email já cadastrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await client.query("INSERT INTO users (email, password) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    return res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return res.status(500).json({ message: "Erro no servidor." });
  }
});

export { router };
