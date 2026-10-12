"use server";

export async function registerAction(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData
) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    console.log(name, email, password);

    if (!name || !email || !password) {
      return { success: false, error: "Preencha todos os campos" };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Senha deve ter pelo menos 6 caracteres",
      };
    }
    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, error: "Erro ao cadastrar usuário" };
  }
}
