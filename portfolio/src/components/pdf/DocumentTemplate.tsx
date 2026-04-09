import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontFamily: 'Helvetica', 
    fontSize: 11, 
    color: '#374151',
    backgroundColor: '#ffffff'
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6', 
    paddingBottom: 20, 
    marginBottom: 30 
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#0f172a',
    letterSpacing: 2
  },
  refText: { 
    color: '#9ca3af', 
    marginTop: 8,
    fontSize: 10
  },
  brandName: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#10b981',
    marginBottom: 4
  },
  sectionInfo: { 
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  billedToBox: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    width: '45%'
  },
  infoLabel: { 
    fontWeight: 'bold', 
    color: '#9ca3af',
    marginBottom: 4,
    fontSize: 10,
    textTransform: 'uppercase'
  },
  infoValue: {
    fontSize: 12,
    color: '#111827',
    marginBottom: 2
  },
  table: { 
    width: '100%', 
    marginTop: 10 
  },
  tableHeader: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e5e7eb', 
    paddingBottom: 8, 
    marginBottom: 8 
  },
  tableRow: { 
    flexDirection: 'row', 
    paddingVertical: 12,
    borderBottomWidth: 1, 
    borderBottomColor: '#f9fafb',
  },
  colDesc: { flex: 1, color: '#111827' },
  colAmount: { width: 120, textAlign: 'right', fontWeight: 'bold' },
  colHeader: { color: '#6b7280', fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  summaryContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    marginTop: 30 
  },
  summaryBox: {
    width: 200,
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  totalRow: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb'
  },
  totalText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#10b981' 
  },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 40, 
    right: 40, 
    textAlign: 'center', 
    color: '#9ca3af', 
    fontSize: 9, 
    borderTopWidth: 1, 
    borderTopColor: '#f3f4f6', 
    paddingTop: 15 
  },
  paidStamp: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  expenseStamp: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1
  }
});

export type DocumentData = {
  _id: string;
  referenceNumber?: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  date: string | Date;
  description: string;
  amount: string | number;
  currency?: string;
  status?: string;
};

export const DocumentTemplate = ({ data, type }: { data: DocumentData, type: 'invoice' | 'receipt' | 'expense' }) => {
  const isExpense = type === 'expense';
  const isReceipt = type === 'receipt' || (data.status === 'paid' && !isExpense);
  const amount = parseFloat(String(data.amount || 0)).toFixed(2);
  
  // Use referenceNumber if it exists, otherwise fallback to the sliced _id
  const referenceCode = data.referenceNumber 
    ? data.referenceNumber.toUpperCase() 
    : (data._id ? data._id.substring(0, 6).toUpperCase() : 'N/A');
  
  let documentTitle = 'INVOICE';
  if (isExpense) documentTitle = 'EXPENSE RECORD';
  else if (isReceipt) documentTitle = 'RECEIPT';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{documentTitle}</Text>
            <Text style={styles.refText}>Ref: {referenceCode}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.brandName}>Brian Maina</Text>
            <Text>Nairobi, Kenya</Text>
            <Text>hello@brianmaina.de</Text>
          </View>
        </View>

        {/* CLIENT INFO & DATES */}
        <View style={styles.sectionInfo}>
          <View style={styles.billedToBox}>
            <Text style={styles.infoLabel}>{isExpense ? 'Vendor / Payee' : 'Billed To'}</Text>
            <Text style={styles.infoValue}>{data.clientName}</Text>
            {data.clientEmail && <Text style={{ color: '#6b7280' }}>{data.clientEmail}</Text>}
            {data.clientPhone && <Text style={{ color: '#6b7280' }}>{data.clientPhone}</Text>}
          </View>
          <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={[styles.infoLabel, { marginRight: 15 }]}>Date Issued:</Text>
              <Text style={styles.infoValue}>{new Date(data.date).toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.infoLabel, { marginRight: 15 }]}>Status:</Text>
              <Text style={[styles.infoValue, { color: isReceipt || isExpense ? '#10b981' : '#f59e0b', fontWeight: 'bold', textTransform: 'uppercase' }]}>
                {isExpense ? 'Deductible' : (isReceipt ? 'Paid' : 'Pending')}
              </Text>
            </View>
          </View>
        </View>

        {/* LINE ITEMS TABLE */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colDesc, styles.colHeader]}>Description</Text>
            <Text style={[styles.colAmount, styles.colHeader]}>Amount</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={styles.colDesc}>{data.description}</Text>
            <Text style={styles.colAmount}>{data.currency || 'USD'} {amount}</Text>
          </View>
        </View>

        {/* TOTALS */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={{ color: '#6b7280' }}>Subtotal</Text>
              <Text>{data.currency || 'USD'} {amount}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={{ fontWeight: 'bold', fontSize: 14 }}>Total</Text>
              <Text style={styles.totalText}>{data.currency || 'USD'} {amount}</Text>
            </View>

            {isReceipt && !isExpense && (
              <View style={[styles.summaryRow, { marginTop: 15, justifyContent: 'flex-end' }]}>
                <Text style={styles.paidStamp}>✓ PAID IN FULL</Text>
              </View>
            )}

            {isExpense && (
              <View style={[styles.summaryRow, { marginTop: 15, justifyContent: 'flex-end' }]}>
                <Text style={styles.expenseStamp}>✓ RECORDED EXPENSE</Text>
              </View>
            )}
          </View>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>
          Thank you for your business! If you have any questions regarding this document, please reach out to hello@brianmaina.de
        </Text>
      </Page>
    </Document>
  );
};