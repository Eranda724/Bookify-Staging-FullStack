import { render, screen } from "@testing-library/react";
import App from "./App";
import { BASE_URL } from "./services/api";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

export const checkBackendConnection = async () => {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("Backend connection failed:", error);
    return false;
  }
};
