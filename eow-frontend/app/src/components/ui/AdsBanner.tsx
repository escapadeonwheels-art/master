import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Gift, Percent, Tag, ArrowRight } from 'phosphor-react-native';
import { colors } from '../../constants/colors';
import { spacing, borderRadius } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import ClaimModal from './ClaimModal';

interface AdsBannerProps {
  onClaim?: () => void;
}

interface Slide {
  id: string;
  icon: React.ReactNode;
  badge: string;
  title: string;
  subtitle: string;
  bgColor: string;
  code?: string;
}

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - spacing.lg * 2;

export default function AdsBanner({ onClaim }: AdsBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollViewRef, setScrollViewRef] = useState<ScrollView | null>(null);
  const [claimModalVisible, setClaimModalVisible] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);

  const slides: Slide[] = [
    {
      id: '1',
      icon: <Gift size={28} color={colors.background} weight="fill" />,
      badge: 'Limited Offer',
      title: 'Get 20% off your next booking',
      subtitle: 'Use code: AIRBNB20',
      code: 'AIRBNB20',
      bgColor: colors.primary,
    },
    {
      id: '2',
      icon: <Percent size={28} color={colors.background} weight="fill" />,
      badge: 'Flash Deal',
      title: 'Free delivery on orders over $30',
      subtitle: 'This weekend only',
      code: 'FREEDEL30',
      bgColor: '#FF385C',
    },
    {
      id: '3',
      icon: <Tag size={28} color={colors.background} weight="fill" />,
      badge: 'Exclusive',
      title: 'Refer a friend and save $10',
      subtitle: 'Both of you benefit',
      code: 'REFER10',
      bgColor: '#FF385C',
    },
  ];

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % slides.length;
        scrollViewRef?.scrollTo({
          x: next * (SLIDE_WIDTH + spacing.lg),
          animated: true,
        });
        return next;
      });
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [scrollViewRef, slides.length]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(scrollPosition / (SLIDE_WIDTH + spacing.lg));
    setCurrentSlide(currentIndex);
  };

  const handleClaimPress = (slide: Slide) => {
    setSelectedSlide(slide);
    setClaimModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Carousel */}
      <ScrollView
        ref={setScrollViewRef}
        horizontal
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={false}
        snapToInterval={SLIDE_WIDTH + spacing.lg}
        decelerationRate="fast"
        onScroll={handleScroll}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide) => (
          <View
            key={slide.id}
            style={[styles.slide, { width: SLIDE_WIDTH, backgroundColor: slide.bgColor }]}
          >
            <View style={styles.content}>
              <View style={styles.iconContainer}>
                {slide.icon}
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.badge}>{slide.badge}</Text>
                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.subtitle}>{slide.subtitle}</Text>
              </View>

              <TouchableOpacity 
                style={styles.claimButton}
                onPress={() => handleClaimPress(slide)}
                activeOpacity={0.7}
              >
                <Text style={styles.claimButtonText}>Claim</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Indicators */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentSlide ? styles.paginationDotActive : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>

      {/* Claim Modal */}
      <ClaimModal
        visible={claimModalVisible}
        onClose={() => setClaimModalVisible(false)}
        onUseNow={() => {
          onClaim?.();
          setClaimModalVisible(false);
        }}
        code={selectedSlide?.code}
        title={`${selectedSlide?.badge || 'Voucher'} Claimed!`}
        subtitle={selectedSlide?.title}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingRight: spacing.lg,
  },
  slide: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15)`,
    height: 140,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  badge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.background,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
    opacity: 0.8,
  },
  title: {
    ...typography.bodyBold,
    color: colors.background,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.small,
    color: colors.background,
    opacity: 0.9,
  },
  actionContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimButton: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  claimButtonText: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 14,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 24,
  },
  paginationDotInactive: {
    backgroundColor: colors.lightGray,
  },
});
