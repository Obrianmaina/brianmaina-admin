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

interface ClientThankYouEmailProps {
  nickname: string;
  service: string;
}

export default function ClientThankYouEmail({
  nickname,
  service,
}: ClientThankYouEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for reaching out! I have received your request.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerSubtitle}>BRIAN MAINA</Text>
            <Heading style={headerTitle}>Design & Development</Heading>
          </Section>

          <Section style={contentSection}>
            <Heading style={greeting}>Hi {nickname},</Heading>
            
            <Text style={paragraph}>
              Thank you so much for reaching out! I have officially received your quote request regarding <strong>{service}</strong>.
            </Text>

            <Text style={paragraph}>
              I am currently reviewing your details and will get back to you within the next 24 to 48 hours with the next steps, some preliminary thoughts, or a few follow-up questions to ensure I fully understand your vision.
            </Text>

            <Text style={paragraph}>
              If you have any extra details, mood boards, or documents you forgot to include in the form, feel free to reply directly to this email!
            </Text>

            <Text style={signOff}>
              Talk soon,<br />
              <strong>Brian Maina</strong>
            </Text>
            
            <Section style={buttonContainer}>
              <Link href="https://brianmaina.de/portfolio" style={button}>
                Explore My Recent Work
              </Link>
            </Section>
          </Section>

          <Hr style={divider} />
          
          <Section style={footer}>
            <Text style={footerText}>
              You are receiving this email because you submitted a quote request at brianmaina.de.
            </Text>
            <Text style={footerText}>
              <Link href="https://brianmaina.de" style={footerLink}>Website</Link> | <Link href="https://www.linkedin.com/in/brian-maina-nyawira" style={footerLink}>LinkedIn</Link> | <Link href="https://www.behance.net/brianmaina3" style={footerLink}>Behance</Link>
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
  backgroundColor: "#0d9488", 
  padding: "30px 40px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
  padding: "0",
};

const headerSubtitle = {
  color: "#ccfbf1",
  fontSize: "12px",
  letterSpacing: "0.1em",
  marginTop: "0",
  marginBottom: "4px",
};

const contentSection = {
  padding: "40px",
};

const greeting = {
  fontSize: "20px",
  fontWeight: "bold",
  color: "#111827",
  marginBottom: "20px",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#374151",
  marginBottom: "20px",
};

const signOff = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#374151",
  marginTop: "30px",
  marginBottom: "30px",
};

const buttonContainer = {
  textAlign: "center" as const,
  marginTop: "20px",
};

const button = {
  backgroundColor: "#f0fdfa",
  border: "1px solid #0d9488",
  borderRadius: "8px",
  color: "#0f766e",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "0",
};

const footer = {
  padding: "24px 40px",
  backgroundColor: "#f9fafb",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#9ca3af",
  margin: "0 0 8px 0",
};

const footerLink = {
  color: "#6b7280",
  textDecoration: "underline",
  margin: "0 8px",
};