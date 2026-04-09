import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";

interface AdminQuoteNotificationEmailProps {
  nickname: string;
  email: string;
  service: string;
  details: string;
}

export default function AdminQuoteNotificationEmail({
  nickname,
  email,
  service,
  details,
}: AdminQuoteNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Lead: {service} from {nickname}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>New Quote Request</Heading>
            <Text style={headerSubtitle}>Brian Maina Portfolio</Text>
          </Section>

          <Section style={contentSection}>
            <Text style={greeting}>You just got a new project inquiry!</Text>
            
            <Section style={infoBlock}>
              <Text style={label}>Client Name:</Text>
              <Text style={value}>{nickname}</Text>

              <Text style={label}>Email Address:</Text>
              <Text style={value}>
                <Link href={`mailto:${email}`} style={link}>{email}</Link>
              </Text>

              <Text style={label}>Requested Service:</Text>
              <Text style={valueHighlight}>{service}</Text>
            </Section>

            <Section style={detailsBlock}>
              <Text style={label}>Project Details:</Text>
              <Text style={detailsText}>
                {details && details.trim() !== "" ? details : "No additional details provided."}
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Link href={`mailto:${email}?subject=Re: Your Inquiry for ${service} (Brian Maina)`} style={button}>
                Reply to Client
              </Link>
            </Section>
          </Section>

          <Hr style={divider} />
          
          <Section style={footer}>
            <Text style={footerText}>
              Sent securely from your portfolio admin system.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// === Styles ===
const main = {
  backgroundColor: "#f9fafb",
  fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  maxWidth: "600px",
};

const header = {
  backgroundColor: "#0d9488", // Your Teal Brand Color
  padding: "30px 40px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const headerSubtitle = {
  color: "#ccfbf1",
  fontSize: "14px",
  marginTop: "5px",
  marginBottom: "0",
};

const contentSection = {
  padding: "40px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "24px",
};

const infoBlock = {
  backgroundColor: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  marginBottom: "24px",
};

const label = {
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "#6b7280",
  fontWeight: "bold",
  margin: "0 0 4px 0",
};

const value = {
  fontSize: "16px",
  color: "#111827",
  margin: "0 0 16px 0",
};

const valueHighlight = {
  fontSize: "16px",
  color: "#0d9488",
  fontWeight: "bold",
  margin: "0",
};

const link = {
  color: "#0d9488",
  textDecoration: "none",
};

const detailsBlock = {
  marginBottom: "32px",
};

const detailsText = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.6",
  backgroundColor: "#f8fafc",
  borderLeft: "4px solid #0d9488",
  padding: "16px",
  margin: "0",
  borderRadius: "0 8px 8px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "10px",
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footer = {
  padding: "20px 40px",
  backgroundColor: "#f9fafb",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0",
};