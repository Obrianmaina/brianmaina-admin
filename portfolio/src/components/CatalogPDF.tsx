import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { CatalogService, CatalogBundle } from '@/types';

// Register custom fonts (Optional: You can link to your brand's Google Font)
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjQ.ttf', fontWeight: 700 }
  ]
});

// Define your brand styles
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Inter', backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40, borderBottomWidth: 2, borderBottomColor: '#0d9488', paddingBottom: 20 },
  brandName: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  tagline: { fontSize: 12, color: '#0d9488', marginTop: 4 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f766e', marginBottom: 20, marginTop: 20 },
  categoryHeader: { backgroundColor: '#f0fdfa', padding: 8, fontSize: 14, fontWeight: 'bold', color: '#0f766e', marginBottom: 10, borderRadius: 4 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemName: { fontSize: 11, color: '#374151', width: '70%' },
  itemPrice: { fontSize: 11, fontWeight: 'bold', color: '#111827', width: '30%', textAlign: 'right' },
  bundleCard: { borderWidth: 1, borderColor: '#e5e7eb', padding: 15, marginBottom: 15, borderRadius: 8 },
  bundleName: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 5 },
  bundleDesc: { fontSize: 10, color: '#6b7280', marginBottom: 10 },
  bundleIncludes: { fontSize: 9, color: '#4b5563', marginBottom: 10 },
  bundlePrice: { fontSize: 12, fontWeight: 'bold', color: '#0d9488', textAlign: 'right' },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 10, color: '#9ca3af', borderTopWidth: 1, borderTopColor: '#f3f4f6', paddingTop: 10 }
});

interface CatalogPDFProps {
  services: CatalogService[];
  bundles: CatalogBundle[];
  currency: 'KES' | 'USD' | 'EUR' | 'GBP';
}

export const CatalogPDF = ({ services, bundles, currency }: CatalogPDFProps) => {
  // Group services by category for the PDF
  const groupedCategories = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, CatalogService[]>);

  const getSymbol = () => {
    if (currency === 'KES') return 'KES ';
    if (currency === 'USD') return '$';
    if (currency === 'EUR') return '€';
    return '£';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>Brian Maina</Text>
            <Text style={styles.tagline}>Design & Development Services</Text>
          </View>
          <View>
            <Text style={{ fontSize: 10, color: '#6b7280', textAlign: 'right' }}>Official Price Guide</Text>
            <Text style={{ fontSize: 10, color: '#6b7280', textAlign: 'right' }}>{new Date().getFullYear()}</Text>
          </View>
        </View>

        {/* Standard Services */}
        <Text style={styles.title}>Service Catalog ({currency})</Text>
        {Object.entries(groupedCategories).map(([category, items]) => (
          <View key={category} style={{ marginBottom: 15 }}>
            <Text style={styles.categoryHeader}>{category}</Text>
            {items.map(item => (
              <View key={item._id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                  {getSymbol()}{item.prices[currency].toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        ))}

        <Text style={styles.footer}>brianmaina.de | Pricing is subject to change based on project scope.</Text>
      </Page>

      {/* Put bundles on a new page if you have a lot of items */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brandName}>Value Bundles</Text>
        </View>
        
        {bundles.map(bundle => (
          <View key={bundle._id} style={styles.bundleCard}>
            <Text style={styles.bundleName}>{bundle.name}</Text>
            <Text style={styles.bundleDesc}>{bundle.description}</Text>
            <Text style={styles.bundleIncludes}>
              Includes: {bundle.includedServices.join(', ')}
            </Text>
            <Text style={styles.bundlePrice}>
              Starting at {getSymbol()}{bundle.prices[currency].toLocaleString()}
            </Text>
          </View>
        ))}
        <Text style={styles.footer}>brianmaina.de | Pricing is subject to change based on project scope.</Text>
      </Page>
    </Document>
  );
};