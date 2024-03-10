import React, { Component, ComponentType, ReactNode, useState } from "react";
import { View, ViewProps, ViewStyle, LayoutChangeEvent } from "react-native";

interface WithParentSizeProps {
  parentSize: {
    width: number;
    height: number;
  };
}

const withParentSize = <P extends WithParentSizeProps>(
  WrappedComponent: ComponentType<P>
) => {
  return (props: ViewProps & P) => {
    const [parentSize, setParentSize] = useState({
      width: 0,
      height: 0,
    });

    const onLayout = (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;

      setParentSize({
        width: width,
        height: height,
      });
    };

    return (
      <View style={{ flex: 1 }} onLayout={onLayout}>
        <WrappedComponent {...(props as P)} parentSize={parentSize} />
      </View>
    );
  };
};
export default withParentSize;
