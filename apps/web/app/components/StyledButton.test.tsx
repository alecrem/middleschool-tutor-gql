import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search, Download } from "lucide-react";
import { StyledButton } from "./StyledButton";
import { mockUseTheme } from "../test-utils/theme-mocks";

// Mock the theme hooks since they depend on context providers
mockUseTheme();

describe("StyledButton", () => {
  describe("Rendering", () => {
    test("renders button with children", () => {
      render(<StyledButton>Click me</StyledButton>);
      expect(
        screen.getByRole("button", { name: "Click me" })
      ).toBeInTheDocument();
    });

    test("renders with custom className", () => {
      render(<StyledButton className="custom-class">Button</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    test("renders with custom style", () => {
      render(
        <StyledButton style={{ marginTop: "10px" }}>Styled Button</StyledButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ marginTop: "10px" });
    });
  });

  describe("Variants", () => {
    test("renders primary variant by default", () => {
      render(<StyledButton>Primary</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        backgroundColor: "#3B82F6",
        color: "#FFFFFF",
      });
    });

    test("renders secondary variant", () => {
      render(<StyledButton variant="secondary">Secondary</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        backgroundColor: "#FFFFFF",
        color: "#111827",
        border: "1px solid #D1D5DB",
      });
    });

    test("renders disabled variant when disabled prop is true", () => {
      render(<StyledButton disabled>Disabled</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        backgroundColor: "#9CA3AF",
        opacity: "0.6",
        cursor: "not-allowed",
      });
    });
  });

  describe("Sizes", () => {
    test("renders medium size by default", () => {
      render(<StyledButton>Medium</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        padding: "12px 16px",
        fontSize: "16px",
        minHeight: "2.5rem",
      });
    });

    test("renders extra small size", () => {
      render(<StyledButton size="xs">Extra Small</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        padding: "4px 8px",
        fontSize: "12px",
        minHeight: "1.5rem",
      });
    });

    test("renders small size", () => {
      render(<StyledButton size="sm">Small</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        padding: "8px 12px",
        fontSize: "14px",
        minHeight: "2rem",
      });
    });

    test("renders large size", () => {
      render(<StyledButton size="lg">Large</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        padding: "16px 20px",
        fontSize: "18px",
        minHeight: "3rem",
      });
    });

    test("renders extra large size", () => {
      render(<StyledButton size="xl">Extra Large</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({
        padding: "20px 24px",
        fontSize: "20px",
        minHeight: "3.5rem",
      });
    });
  });

  describe("Disabled State", () => {
    test("button is disabled when disabled prop is true", () => {
      render(<StyledButton disabled>Disabled Button</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveStyle({
        opacity: "0.6",
        cursor: "not-allowed",
      });
    });

    test("button is enabled by default", () => {
      render(<StyledButton>Enabled Button</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toBeEnabled();
    });
  });

  describe("Full Width", () => {
    test("renders full width when fullWidth is true", () => {
      render(<StyledButton fullWidth>Full Width</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "100%" });
    });

    test("renders auto width by default", () => {
      render(<StyledButton>Auto Width</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveStyle({ width: "auto" });
    });
  });

  describe("Icons", () => {
    test("renders with left icon by default", () => {
      render(<StyledButton icon={Search}>Search</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Icon should be rendered before text
      const spans = button.querySelectorAll("span");
      expect(spans).toHaveLength(1);
    });

    test("renders with right icon", () => {
      render(
        <StyledButton icon={Download} iconPosition="right">
          Download
        </StyledButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      // Icon should be rendered after text
      const spans = button.querySelectorAll("span");
      expect(spans).toHaveLength(1);
    });

    test("renders without icon when icon prop is not provided", () => {
      render(<StyledButton>No Icon</StyledButton>);
      const button = screen.getByRole("button");
      expect(button.textContent).toBe("No Icon");
      // No span wrapper should be present
      const spans = button.querySelectorAll("span");
      expect(spans).toHaveLength(0);
    });
  });

  describe("User Interactions", () => {
    test("calls onClick when clicked", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<StyledButton onClick={handleClick}>Click me</StyledButton>);

      await user.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test("does not call onClick when disabled", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <StyledButton onClick={handleClick} disabled>
          Disabled
        </StyledButton>
      );

      await user.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    test("calls onMouseEnter and onMouseLeave", () => {
      const handleMouseEnter = vi.fn();
      const handleMouseLeave = vi.fn();

      render(
        <StyledButton
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Hover me
        </StyledButton>
      );

      const button = screen.getByRole("button");
      fireEvent.mouseEnter(button);
      expect(handleMouseEnter).toHaveBeenCalledTimes(1);

      fireEvent.mouseLeave(button);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });

    test("disabled button does not receive mouse events", () => {
      const handleMouseEnter = vi.fn();

      render(
        <StyledButton disabled onMouseEnter={handleMouseEnter}>
          Disabled Hover
        </StyledButton>
      );

      const button = screen.getByRole("button");
      fireEvent.mouseEnter(button);
      // Disabled buttons don't receive mouse events in most browsers
      expect(handleMouseEnter).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    test("supports keyboard navigation", async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(<StyledButton onClick={handleClick}>Keyboard</StyledButton>);

      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard("{Enter}");
      expect(handleClick).toHaveBeenCalledTimes(1);

      await user.keyboard(" ");
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    test("has proper ARIA attributes when disabled", () => {
      render(<StyledButton disabled>ARIA Test</StyledButton>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });
  });

  describe("HTML Attributes", () => {
    test("forwards HTML button attributes", () => {
      render(
        <StyledButton
          type="submit"
          form="test-form"
          data-testid="submit-button"
        >
          Submit
        </StyledButton>
      );

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
      expect(button).toHaveAttribute("form", "test-form");
      expect(button).toHaveAttribute("data-testid", "submit-button");
    });
  });
});

describe("StyledButton Snapshots", () => {
  test("matches snapshot for default primary button", () => {
    const { container } = render(<StyledButton>Primary Button</StyledButton>);
    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot for secondary button with icon", () => {
    const { container } = render(
      <StyledButton variant="secondary" icon={Search} size="lg">
        Search Button
      </StyledButton>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot for disabled button", () => {
    const { container } = render(
      <StyledButton disabled fullWidth>
        Disabled Full Width
      </StyledButton>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test("matches snapshot for extra small button with right icon", () => {
    const { container } = render(
      <StyledButton size="xs" icon={Download} iconPosition="right">
        Download
      </StyledButton>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
