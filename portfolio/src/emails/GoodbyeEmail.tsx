import { Body, Container, Head, Html, Preview, Text, Section } from "@react-email/components";
import * as React from "react";

interface GoodbyeEmailProps {
  nickname: string;
}

export default function GoodbyeEmail({ nickname }: GoodbyeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You have been unsubscribed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={contentSection}>
            <Text style={greeting}>Hi {nickname},</Text>
            
            <Text style={text}>
              This is just a quick note to confirm that you have been successfully unsubscribed from my updates. 
            </Text>
            
            <Text style={text}>
              I appreciate the time you spent on my list. If you ever need design help in the future, you can always reach out through my website.
            </Text>

            <Text style={signOff}>
              Wishing you all the best,<br />
              <strong>Brian Maina</strong>
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