import { style } from "d3";
import {
  Children,
  ReactElement,
  ReactNode,
  cloneElement,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { IButton } from "./Button";

interface IProps {
  selectIndex: number;
  children: ReactNode | ReactNode[];
}

export default ({ children, selectIndex }: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(
    selectIndex
  );
  const childrens = Children.toArray(children);

  return (
    <View style={styles.root}>
      <View style={styles.container}>
        {childrens.map((child, index) =>
          cloneElement(child as ReactElement<IButton>, {
            ...(child as React.ReactElement<IButton>).props,
            key: index,
            active: activeIndex === index,
            onPress: () => {
              setActiveIndex(index);
              (child as React.ReactElement<IButton>).props.onPress();
            },
          })
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
  },
  container: {
    flexDirection: "row",
    columnGap: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
