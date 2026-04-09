import { Body, Container, Head, Html, Preview, Text, Link, Section } from "@react-email/components";
import * as React from "react";

interface SubscriptionConfirmedEmailProps {
  nickname: string;
  userEmail: string;
}

export default function SubscriptionConfirmedEmail({ nickname, userEmail }: SubscriptionConfirmedEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://brianmaina.de";

  return (
    <Html>
      <Head />
      <Preview>Welcome! Your subscription is confirmed.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={contentSection}>
            <Text style={greeting}>Hi {nickname},</Text>
            
            <Text style={text}>
              Your email is verified and your subscription is officially confirmed! 
            </Text>
            
            <Text style={text}>
              You will now receive occasional updates on my freelance availability, along with some behind the scenes looks at my design and UI/UX projects.
            </Text>

            <Text style={text}>
              Feel free to reply directly to this email if you have any questions. I read every response.
            </Text>
            
            <Text style={signOff}>
              Talk soon,<br />
              <strong>Brian Maina</strong>
            </Text>

            <Text style={finePrint}>
              You are receiving this because you opted in at brianmaina.de. <Link href={`${baseUrl}/unsubscribe?email=${userEmail}`} style={link}>Unsubscribe</Link> at any time.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: "#f3f4f6", fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', padding: "40px 20px" };
const container = { margin: "0 auto", maxWidth: "600px", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)" };
const contentSection = { padding: "40px 48px" };
const greeting = { color: "#111827", fontSize: "18px", fontWeight: "600", margin: "0 0 20px" };
const text = { color: "#374151", fontSize: "16px", lineHeight: "26px", margin: "0 0 24px" };
const signOff = { color: "#374151", fontSize: "16px", lineHeight: "24px", margin: "32px 0 0" };
const finePrint = { color: "#9ca3af", fontSize: "12px", lineHeight: "18px", marginTop: "48px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" };
const link = { color: "#6b7280", textDecoration: "underline" };