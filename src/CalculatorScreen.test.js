import { render, fireEvent } from "@testing-library/react";
import CalculatorScreen from "./App"; // Adjust this if CalculatorScreen is in its own file

function renderCalculator() {
  return render(
    <CalculatorScreen
      onNavigate={() => {}}
      theme="light"
      setTheme={() => {}}
      history={[]}
      setHistory={() => {}}
      soundEnabled={false}
      fontSize={24}
    />
  );
}

test("Calculator adds numbers correctly", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("2"));
  fireEvent.click(getByText("+"));
  fireEvent.click(getByText("3"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toMatch(/2\+3 = 5/);
});

test("Calculator subtracts numbers correctly", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("5"));
  fireEvent.click(getByText("-"));
  fireEvent.click(getByText("2"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toMatch(/5-2 = 3/);
});

test("Calculator multiplies numbers correctly", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("4"));
  fireEvent.click(getByText("×"));
  fireEvent.click(getByText("3"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toMatch(/4×3 = 12/);
});

test("Calculator divides numbers correctly", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("8"));
  fireEvent.click(getByText("÷"));
  fireEvent.click(getByText("2"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toMatch(/8÷2 = 4/);
});

test("Calculator clears input", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("9"));
  fireEvent.click(getByText("C"));

  const display = container.querySelector(".display");
  expect(display.textContent).toBe("");
});

test("Calculator shows error on invalid expression", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toBe("Error");
});

test("Calculator adds decimal numbers correctly", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("2"));
  fireEvent.click(getByText("."));
  fireEvent.click(getByText("5"));
  fireEvent.click(getByText("+"));
  fireEvent.click(getByText("1"));
  fireEvent.click(getByText("."));
  fireEvent.click(getByText("5"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toMatch(/2\.5\+1\.5 = 4/);
});

test("Calculator handles multiple operations in sequence", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("2"));
  fireEvent.click(getByText("+"));
  fireEvent.click(getByText("3"));
  fireEvent.click(getByText("×"));
  fireEvent.click(getByText("4"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toMatch(/2\+3×4 = 14/);
});

test("Calculator shows error on operator without number", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("+"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toBe("Error");
});

test("Calculator handles divide by zero", () => {
  const { getByText, container } = renderCalculator();

  fireEvent.click(getByText("8"));
  fireEvent.click(getByText("÷"));
  fireEvent.click(getByText("0"));
  fireEvent.click(getByText("="));

  const display = container.querySelector(".display");
  expect(display.textContent).toMatch(/8÷0 = Infinity/);
});

test("Calculator handles negative result", () => {
    const { getByText, container } = renderCalculator();
  
    fireEvent.click(getByText("2"));
    fireEvent.click(getByText("-"));
    fireEvent.click(getByText("5"));
    fireEvent.click(getByText("="));
  
    const display = container.querySelector(".display");
    expect(display.textContent).toMatch(/2-5 = -3/);
  });
  test("Calculator handles decimal addition", () => {
    const { getByText, container } = renderCalculator();
  
    fireEvent.click(getByText("1"));
    fireEvent.click(getByText("."));
    fireEvent.click(getByText("2"));
    fireEvent.click(getByText("+"));
    fireEvent.click(getByText("3"));
    fireEvent.click(getByText("."));
    fireEvent.click(getByText("4"));
    fireEvent.click(getByText("="));
  
    const display = container.querySelector(".display");
    expect(display.textContent).toMatch(/1\.2\+3\.4 = 4.6/);
  });
  test("Calculator clears after result", () => {
    const { getByText, container } = renderCalculator();
  
    fireEvent.click(getByText("7"));
    fireEvent.click(getByText("+"));
    fireEvent.click(getByText("1"));
    fireEvent.click(getByText("="));
    fireEvent.click(getByText("C"));
  
    const display = container.querySelector(".display");
    expect(display.textContent).toBe("");
  });
  test("Calculator handles long expression", () => {
    const { getByText, container } = renderCalculator();
  
    fireEvent.click(getByText("1"));
    fireEvent.click(getByText("+"));
    fireEvent.click(getByText("2"));
    fireEvent.click(getByText("+"));
    fireEvent.click(getByText("3"));
    fireEvent.click(getByText("+"));
    fireEvent.click(getByText("4"));
    fireEvent.click(getByText("="));
  
    const display = container.querySelector(".display");
    expect(display.textContent).toMatch(/1\+2\+3\+4 = 10/);
  });

  test("Calculator handles empty input on equals", () => {
    const { getByText, container } = renderCalculator();
  
    fireEvent.click(getByText("="));
  
    const display = container.querySelector(".display");
    expect(display.textContent).toBe("Error");
  });
  
  test("Calculator handles multiple equals presses", () => {
    const { getByText, container } = renderCalculator();
  
    fireEvent.click(getByText("2"));
    fireEvent.click(getByText("+"));
    fireEvent.click(getByText("2"));
    fireEvent.click(getByText("="));
    fireEvent.click(getByText("=")); // press = again
  
    const display = container.querySelector(".display");
    // Depending on your app logic, adjust this expectation
    expect(display.textContent).toMatch(/2\+2 = 4/);
  });
  
          