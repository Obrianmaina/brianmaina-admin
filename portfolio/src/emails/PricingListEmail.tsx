import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface PricingItem {
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface PricingListEmailProps {
  clientName: string;
  title: string;
  currency: string;
  items: PricingItem[];
  subtotal: number;
  tax: number;
  totalAmount: number;
}

export const PricingListEmail = ({
  clientName,
  title,
  currency,
  items,
  subtotal,
  tax,
  totalAmount,
}: PricingListEmailProps) => (
  <Html>
    <Head />
    <Preview>Pricing Estimate for {title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Project Estimate</Heading>
          <Text style={subtitle}>{title}</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Hello {clientName},</Text>
          <Text style={paragraph}>
            Thank you for reaching out. Based on our discussion, here is the
            customized pricing breakdown for your project.
          </Text>

          <Hr style={hr} />

          <Section>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={{ width: "70%" }}>
                  <Text style={itemName}>{item.name}</Text>
                  {item.description && (
                    <Text style={itemDesc}>{item.description}</Text>
                  )}
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text style={itemPrice}>
                    {item.quantity} x {currency} {item.unitPrice.toFixed(2)}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={hr} />

          <Section style={footerSection}>
            <Row>
              <Column style={{ textAlign: "right" }}>
                <Text style={totalLabel}>Subtotal: {currency} {subtotal.toFixed(2)}</Text>
                <Text style={totalLabel}>Tax: {tax}%</Text>
                <Text style={grandTotal}>
                  Total: {currency} {totalAmount.toFixed(2)}
                </Text>
              </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            If you have any questions or would like to proceed, please feel free
            to reply to this email.
          </Text>
          <Text style={signature}>
            Best regards,<br />
            Brian Maina
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PricingListEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "12px",
  border: "1px solid #e6ebf1",
};

const header = {
  padding: "32px",
  borderBottom: "1px solid #e6ebf1",
  textAlign: "center" as const,
};

const h1 = {
  color: "#0d9488",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
};

const subtitle = {
  color: "#64748b",
  fontSize: "16px",
  margin: "8px 0 0",
};

const content = {
  padding: "32px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1e293b",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#475569",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const itemRow = {
  padding: "12px 0",
};

const itemName = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1e293b",
  margin: "0",
};

const itemDesc = {
  fontSize: "14px",
  color: "#64748b",
  margin: "4px 0 0",
};

const itemPrice = {
  fontSize: "14px",
  color: "#475569",
  margin: "0",
};

const footerSection = {
  marginTop: "20px",
};

const totalLabel = {
  fontSize: "14px",
  color: "#64748b",
  margin: "4px 0",
};

const grandTotal = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#0d9488",
  marginTop: "12px",
};

const signature = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#1e293b",
  marginTop: "32px",
};