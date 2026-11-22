import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, MapPin, ArrowLeft, Clock } from 'phosphor-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { fetchArticleContent, StrapiRichTextContentNode, fetchArticles } from '../../mock/data'; // Adjust this path to match your data.ts location

interface BookingDetailsScreenProps {
  route?: any;
  navigation?: any;
}

export default function BookingDetailsScreen({ route, navigation }: BookingDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [windowDimensions, setWindowDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktopViewport = Platform.OS === 'web' && windowDimensions.width >= 1024;

  const [articleContent, setArticleContent] = useState<StrapiRichTextContentNode[]>([]);
  const [isContentLoading, setIsContentLoading] = useState<boolean>(true);

  // Extract parameters strictly from navigation parameters route context
  const routeService = route?.params?.service;
  const routeSlug = route?.params?.slug;

  console.log(`[ROUTE PARAM DECONSTRUCTION LOG]
    📥 Raw route.params payload:`, route?.params, `
    📝 Ingested routeSlug text: "${routeSlug}"
    🏷️ Type of routeSlug: "${typeof routeSlug}"
    📦 Hex-Encoded Representation: "${routeSlug ? encodeURIComponent(routeSlug) : 'N/A'}"
  `);

  const [service, setService] = useState<any>(routeService || {
    id: '',
    title: 'Loading...',
    location: 'Loading...',
    price: 0,
    rating: 0,
    reviews: 0,
    image: '',
    host: 'Default',
    //description: 'Default',
    type: 'travel',
    content: [],
  });

    // TARGETED RESOLUTION LIFECYCLE EFFECT HOOK
  useEffect(() => {
    async function resolveArticleFromSlug() {
      if (routeSlug && !routeService) {
        try {
          setIsContentLoading(true);
          
          console.log(`[CHECKPOINT 3A - DETAILS ENTRY] Ingested parameter routeSlug: "${routeSlug}"`);

          // 🎯 FIX: Pass it explicitly using the newly supported 'slug' parameter block configuration
          const targetedArticles = await fetchArticles({ slug: routeSlug.trim() });

          
          const matchedArticle = targetedArticles.find((item: any) => {
            const targetSlug = String(routeSlug).toLowerCase().trim();
            const itemSlug = String(item.slug || '').toLowerCase().trim();
            return itemSlug === targetSlug;
          });
          
          if (matchedArticle) {
            console.log(`[DETAILS MATCH SUCCESS] Found Document ID: ${matchedArticle.id}`);
            setService(matchedArticle);
          } else {
            console.warn(`[DETAILS MATCH FAILURE] 🚨 Could not resolve slug: "${routeSlug}" even with a targeted fetch query.`);
            setService((prev: any) => ({ ...prev, title: 'Tour Not Found' }));
            setIsContentLoading(false);
          }
        } catch (error) {
          console.error("Failed resolving deep link content slug structure:", error);
          setIsContentLoading(false);
        }
      }
    }
    resolveArticleFromSlug();
  }, [routeSlug, routeService]);

  // LAZY LOAD CONTENT ON MOUNT FOR THE SPECIFIC ARTICLE ID
  useEffect(() => {
    async function loadFullArticleBody() {
      if (!service.id) {
        if (!routeSlug) {
          setIsContentLoading(false);
        }
        return;
      }
      
      try {
        setIsContentLoading(true);
        const contentData = await fetchArticleContent(service.id);
        setArticleContent(contentData);
      } catch (error) {
        console.error("Failed loading rich text body:", error);
      } finally {
        setIsContentLoading(false);
      }
    }

    loadFullArticleBody();
  }, [service.id, routeSlug]);

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
        <Text style={styles.headerTitle}>Tour Details</Text>
        <View style={styles.spacer} />
      </View>

      {/* Prominent yellow price ticker row aligned cleanly to the left side */}
      <View style={styles.costTickerRow}>
        <Text style={styles.costLabel}>Package Cost:</Text>
        <View style={styles.yellowStickerBadge}>
          <Text style={styles.stickerText}>
            {service.price} <Text style={styles.stickerLabelText}>Onwards</Text>
            {service.duration !== undefined && service.duration > 0 && (
              <Text style={styles.stickerLabelText}>
                {' • '}{service.duration} {service.duration === 1 ? 'Day' : 'Days'}
              </Text>
            )}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContainer,
          isDesktopViewport && { maxWidth: 1200, width: '100%', alignSelf: 'center' }
        ]}
      >
        {/* 1. Wrapped the picture frame inside a padding structure helper to inject margins on mobile screen viewports */}
        <View style={[
          styles.imageOuterWrapper,
          isDesktopViewport && styles.imageOuterWrapperDesktop
        ]}>
          <View style={[
            styles.imageContainer, 
            isDesktopViewport && styles.imageContainerDesktop
          ]}>
            <Image 
              source={{ uri: service.image }} 
              style={styles.image}
              resizeMode={isDesktopViewport ? 'contain' : 'cover'} 
            />
            {!isDesktopViewport && <LinearGradient colors={['transparent', 'rgba(0,0,0,0.4)']} style={styles.gradient} />}
          </View>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{service.title}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.gray} weight="bold" />
            <Text style={styles.location}>{service.location}</Text>
          </View>

          {service.duration !== undefined && service.duration > 0 && (
            <View style={styles.durationRow}>
              <Clock size={16} color={colors.primary || colors.gray} weight="bold" />
              <Text style={styles.durationText}>
                Duration: {service.duration} {service.duration === 1 ? 'Day' : 'Days'}
              </Text>
            </View>
          )}

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
  
  costTickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FAFFA0',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.dark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  yellowStickerBadge: {
    backgroundColor: '#FFEB3B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  stickerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  stickerLabelText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#424242',
  },

  content: { flex: 1 },
  scrollContainer: { paddingBottom: 16 },
  
  // 2. Added mobile margin shell spacing variables
  imageOuterWrapper: {
    width: '100%',
    paddingHorizontal: 16, // Beautiful structural gutters around left and right of the image asset on mobile
    marginTop: 16,
  },
  imageOuterWrapperDesktop: {
    paddingHorizontal: 0, // Clears the mobile outer buffer container when using the desktop layout limiter shell
    marginTop: 0,
  },
  imageContainer: { 
    width: '100%',
    height: 220, // Adjusted layout scale slightly to match narrow mobile card container dimensions nicely
    position: 'relative', 
    backgroundColor: '#f8f9fa',
    borderRadius: 12, // Smooth corner radius curves blending beautifully with surrounding context fields
    overflow: 'hidden',
  },
  imageContainerDesktop: {
    height: 450,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 16,
  },
  image: { width: '100%', height: '100%' },
  gradient: { ...StyleSheet.absoluteFillObject },
  titleSection: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.dark, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  location: { fontSize: 14, color: colors.gray, marginLeft: 4 },
  durationRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  durationText: { fontSize: 14, fontWeight: '600', color: colors.dark, marginLeft: 6 },
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