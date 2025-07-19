type Result<T, E> =
  | { status: "success"; data: T }
  | { status: "error"; error: E };

type UserNotFoundError = { message: string };

export const stackClientApp = {
  async sendForgotPasswordEmail(email: string): Promise<Result<undefined, UserNotFoundError>> {
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (result.status === "success") {
        return { status: "success", data: undefined };
      } else {
        return { status: "error", error: result.error };
      }
    } catch (e) {
      return { status: "error", error: { message: "Network or server error" } };
    }
  },
};
