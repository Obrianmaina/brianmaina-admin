import { Html, Head, Preview, Body, Container, Section, Heading, Text } from '@react-email/components';
import * as React from 'react';

interface AccessCodeEmailProps {
  validationCode: string;
}

export default function AccessCodeEmail({ validationCode }: AccessCodeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your access code for Brian Maina&apos;s Portfolio</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={contentSection}>
            <Heading style={h1}>Access to Portfolio References</Heading>
            
            <Text style={text}>Hello,</Text>
            
            <Text style={text}>
              Thank you for your interest. Please use the following code to view my references&apos; contact details. This code is valid for 15 minutes.
            </Text>

            <Section style={codeContainer}>
              <Text style={codeText}>
                {validationCode}
              </Text>
            </Section>

            <Text style={finePrint}>
              If you did not request this code, you can safely ignore this email.
            </Text>
            
            <Text style={signOff}>
              Best regards,<br />
              <strong>Brian</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Consistent Styles
const main = { 
  backgroundColor: "#f3f4f6", 
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', 
  padding: "40px 20px" 
};

const container = { 
  margin: "0 auto", 
  maxWidth: "600px", 
  backgroundColor: "#ffffff", 
  borderRadius: "12px", 
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" 
};

const contentSection = { 
  padding: "40px 48px" 
};

const h1 = { 
  fontSize: "24px", 
  color: "#111827", 
  fontWeight: "700", 
  margin: "0 0 24px",
  lineHeight: "1.2"
};

const text = { 
  color: "#374151", 
  fontSize: "16px", 
  lineHeight: "26px", 
  margin: "0 0 20px" 
};

const codeContainer = { 
  textAlign: "center" as const, 
  backgroundColor: "#f9fafb", 
  padding: "32px 20px", 
  borderRadius: "8px", 
  margin: "24px 0",
  border: "1px solid #e5e7eb"
};

const codeText = { 
  fontSize: "36px", 
  letterSpacing: "10px", 
  margin: "0", 
  fontWeight: "bold", 
  color: "#0d9488" // Teal accent color to match your verification button
};

const finePrint = { 
  fontSize: "13px", 
  color: "#6b7280", 
  lineHeight: "20px",
  margin: "24px 0 0" 
};

const signOff = { 
  color: "#374151", 
  fontSize: "16px", 
  lineHeight: "24px", 
  margin: "32px 0 0" 
};