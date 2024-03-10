import { Rect } from "@shopify/react-native-skia";
import React, {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedReaction,
  useAnimatedScrollHandler,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
const { width, height } = Dimensions.get("screen");
interface Props {
  x: SharedValue<number>;
  children: ReactNode | ReactNode[];
  style?: { [key: string]: any };
  side: SharedValue<number>;
  contentWidth?: number;
  onScrollEnd?: (index: number) => void;
}
interface SlideProps {
  children: ReactNode | ReactNode[];
  style?: { [key: string]: any };
}

const Slide = ({ children }: SlideProps) => {
  return (
    <Animated.View
      style={[
        {
          width,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};
export default forwardRef<any, Props>(
  ({ x, children, style, side, onScrollEnd, contentWidth }, ref) => {
    const scroll = useRef<Animated.ScrollView>(null);
    const slides = React.Children.toArray(children);

    const onScroll = useAnimatedScrollHandler({
      onScroll: ({ contentOffset }) => {
        x!.value = contentOffset.x;
      },
    });
    useAnimatedReaction(
      () => x.value,
      (newValue, previousValue) => {
        if (newValue > (previousValue || 0)) {
          side.value = 1; // Vers la droite
        } else if (newValue < (previousValue || 0)) {
          side.value = -1; // Vers la gauche
        }
      }
    );

    useImperativeHandle(ref, () => {
      return {
        scrollTo(translateX: number) {
          scroll.current?.scrollTo({ x: translateX });
        },
      };
    });
    const handleScrollEnd = () => {
      const index = x!.value / width;
      onScrollEnd?.(index);
    };
    return (
      <Animated.ScrollView
        onMomentumScrollEnd={handleScrollEnd}
        contentOffset={{ x: x!.value }}
        scrollEventThrottle={16}
        style={style}
        ref={scroll}
        ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        bounces={true}
        decelerationRate="fast"
        {...{ onScroll }}
        contentContainerStyle={{ width: contentWidth || width * 7 }}
      >
        {slides.length <= 1 ? (
          <>
            <View
              style={{
                width: width * 7,
                height: 100,
                position: "absolute",
              }}
            />
          </>
        ) : (
          slides.map((el, key) => <Slide {...{ key }}>{el}</Slide>)
        )}
      </Animated.ScrollView>
    );
  }
);
