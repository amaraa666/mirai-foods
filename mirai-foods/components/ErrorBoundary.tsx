import React, { Component, type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
  onRetry?: () => void;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("[ErrorBoundary]", error);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.fallback}>
          <Text style={styles.title}>
            {this.props.fallbackTitle ?? "Something went wrong"}
          </Text>
          <Text style={styles.message}>
            This screen could not load. Try again or go back and return.
          </Text>
          <Pressable style={styles.btn} onPress={this.handleRetry}>
            <Text style={styles.btnText}>Try again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#FAF7F4",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4A151B",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#707070",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#4A151B",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
