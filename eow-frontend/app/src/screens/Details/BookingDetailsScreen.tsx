import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, MapPin, ArrowLeft } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { fetchArticleContent, StrapiRichTextContentNode } from '../../mock/data'; // 👈 Adjust this path to match your data.ts location

const { width } = Dimensions.get('window');

interface BookingDetailsScreenProps {
  route?: any;
  navigation?: any;
}

export default function BookingDetailsScreen({ route, navigation }: BookingDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  // ⚡ STATE MANAGEMENT FOR CONTENT LAZY-LOADING
  const [articleContent, setArticleContent] = useState<StrapiRichTextContentNode[]>([]);
  const [isContentLoading, setIsContentLoading] = useState<boolean>(true);

  const service = route?.params?.service || {
    id: '',
    title: 'Default Title',
    location: 'Default Location',
    price: 0,
    rating: 0,
    reviews: 0,
    image: '',
    host: 'Default',
    description: 'Default',
    type: 'travel',
    content: [],
  };

  // ⚡ LAZY LOAD CONTENT ON MOUNT FOR THE SPECIFIC ARTICLE ID
  useEffect(() => {
    async function loadFullArticleBody() {
      if (!service.id) {
        setIsContentLoading(false);
        return;
      }
      setIsContentLoading(true);
      const contentData = await fetchArticleContent(service.id);
      setArticleContent(contentData);
      setIsContentLoading(false);
    }

    loadFullArticleBody();
  }, [service.id]);

  const handleBookNow = () => {};
  const handleConfirmBooking = () => { setBookingModalVisible(true); };
  const handleCloseBookingModal = () => { setBookingModalVisible(false); };
  const handleRetryBooking = () => { handleConfirmBooking(); };
  const handleViewBooking = () => { handleCloseBookingModal(); navigation?.navigate('Bookings' as never); };

  const handleBookingConfirm = (data: any) => {
    setBookingModalVisible(false);
    setConfirmationData({
      confirmationNumber: `AIRBNB-${Date.now().toString().slice(-6)}`,
      checkInDate: data?.checkInDate || '2024-01-15',
      checkOutDate: data?.checkOutDate || '2024-01-20',
      guests: data?.guests || 2,
      totalPrice: data?.totalPrice || 1320,
      ...data,
    });
    setConfirmationVisible(true);
  };

  // The Parser Function
  const renderJsonToNative = (nodes: any[]) => {
    if (!Array.isArray(nodes) || nodes.length === 0) return null;

    const renderInlineText = (children: any[]) => {
      if (!Array.isArray(children)) return null;
      
      return children.map((child, idx) => {
        const inlineStyle = [
          child.bold && { fontWeight: 'bold' as const },
          child.italic && { fontStyle: 'italic' as const },
          child.underline && { textDecorationLine: 'underline' as const }
        ].filter(Boolean);

        return (
          <Text key={idx} style={inlineStyle}>
            {child.text}
          </Text>
        );
      });
    };

    return nodes.map((node, index) => {
      if (node.type === 'heading' || node.type === 'paragraph') {
        const hasContent = node.children?.some((c: any) => c.text?.trim());
        if (!hasContent) return null;

        return node.type === 'heading' ? (
          <Text key={index} style={styles.nativeH3}>
            {renderInlineText(node.children)}
          </Text>
        ) : (
          <Text key={index} style={styles.nativeParagraph}>
            {renderInlineText(node.children)}
          </Text>
        );
      }

      if (node.type === 'list') {
        return (
          <View key={index} style={styles.listContainer}>
            {node.children?.map((listItem: any, itemIdx: number) => (
              <View key={itemIdx} style={styles.listItemRow}>
                <Text style={styles.bulletPoint}>
                  {node.format === 'ordered' ? `${itemIdx + 1}. ` : '• '}
                </Text>
                <Text style={styles.listItemText}>
                  {renderInlineText(listItem.children)}
                </Text>
              </View>
            ))}
          </View>
        );
      }

      return null;
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <ArrowLeft size={24} color={colors.dark} weight="bold" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
      >
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: service.image }} style={styles.image} />
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} style={styles.gradient} />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{service.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.gray} weight="bold" />
            <Text style={styles.location}>{service.location}</Text>
          </View>
        </View>

        {/* Description/Content Section */}
        <View style={styles.descriptionSection}>
          {isContentLoading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="small" color={colors.primary || '#000'} />
              <Text style={styles.loadingText}>Loading article details...</Text>
            </View>
          ) : (
            renderJsonToNative(articleContent)
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'between', paddingHorizontal: 16, height: 56 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.dark, flex: 1, textAlign: 'center' },
  spacer: { width: 32 },
  content: { flex: 1 },
  imageContainer: { width: width, height: 250, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradient: { ...StyleSheet.absoluteFillObject },
  titleSection: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.dark, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  location: { fontSize: 14, color: colors.gray, marginLeft: 4 },
  descriptionSection: { paddingHorizontal: 16, marginTop: 8 },
  nativeH3: { fontSize: 20, fontWeight: 'bold', marginVertical: 12, color: colors.dark },
  nativeParagraph: { fontSize: 16, lineHeight: 24, color: colors.dark, marginBottom: 12 },
  listContainer: { marginVertical: 8, paddingLeft: 8 },
  listItemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  bulletPoint: { fontSize: 16, marginRight: 6, color: colors.dark },
  listItemText: { fontSize: 16, lineHeight: 22, color: colors.dark, flex: 1 },
  loaderContainer: { paddingVertical: 30, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 8, fontSize: 14, color: colors.gray },
});
