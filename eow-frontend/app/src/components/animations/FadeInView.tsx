import { View } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

export default function FadeInView({ children }: FadeInViewProps) {
  // Simple pass-through component that preserves all children visibility
  // Animation handled by natural component rendering
  return <View>{children}</View>;
}
