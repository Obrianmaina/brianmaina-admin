import { Body, Container, Head, Html, Preview, Text, Link, Img, Section } from "@react-email/components";
import * as React from "react";

interface NewsletterEmailProps {
  nickname: string;
  userEmail: string;
  message: string; 
  imageUrl?: string; 
}

export default function NewsletterEmail({ nickname, userEmail, message, imageUrl }: NewsletterEmailProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://brianmaina.de";

  return (
    <Html>
      <Head />
      <Preview>New update from Brian Maina</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Feature Image */}
          {imageUrl && (
            <Section style={imageSection}>
              <Img 
                src={imageUrl} 
                width="100%" 
                style={headerImage} 
                alt="Newsletter Feature Image" 
              />
            </Section>
          )}
          
          {/* Main Content Card */}
          <Section style={contentSection}>
            <Text style={greeting}>Hi {nickname},</Text>
            
            <Text style={text}>
              {message}
            </Text>
            
            <Text style={signOff}>
              Talk soon,<br />
              <strong>Brian Maina</strong>
            </Text>

            <Text style={finePrint}>
              You are receiving this because you opted in at brianmaina.de. If you prefer not to get these updates, you can reply &ldquo;Unsubscribe&rdquo; or <Link href={`${baseUrl}/unsubscribe?email=${userEmail}`} style={link}>click here to unsubscribe</Link> at any time. (Sent to: {userEmail})
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Updated Styles for better spacing and edge-to-edge prevention
const main = { 
  backgroundColor: "#f3f4f6", 
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  // Provides 20px buffer on mobile so the card never touches screen edges
  padding: "40px 20px" 
};

const container = { 
  margin: "0 auto", 
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "12px", 
  overflow: "hidden", 
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
};

const imageSection = {
  width: "100%",
};

const headerImage = {
  maxWidth: "100%",
  display: "block",
  objectFit: "cover" as const,
  maxHeight: "300px",
};

const contentSection = {
  // Increased horizontal padding (48px) to keep text away from the white edges
  padding: "40px 48px", 
};

const greeting = {
  color: "#111827", 
  fontSize: "18px", 
  fontWeight: "600",
  margin: "0 0 20px",
  // Added significant space (32px) below the image before the text starts
  paddingTop: "32px", 
};

const text = { 
  color: "#374151", 
  fontSize: "16px", 
  lineHeight: "26px", 
  margin: "0 0 24px", 
  whiteSpace: "pre-wrap" as const 
};

const signOff = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "24px",
  // Margin-top adds space between the message and your signature
  margin: "32px 0 0",
};

const finePrint = { 
  color: "#9ca3af", 
  fontSize: "12px", 
  lineHeight: "18px", 
  marginTop: "48px",
  paddingTop: "24px",
  borderTop: "1px solid #e5e7eb"
};

const link = { 
  color: "#6b7280", 
  textDecoration: "underline" 
};