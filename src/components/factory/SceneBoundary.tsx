"use client";
import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { dead: boolean };

export class SceneBoundary extends Component<Props, State> {
  state: State = { dead: false };
  static getDerivedStateFromError() {
    return { dead: true };
  }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.warn("[factory scene]", err.message, info.componentStack);
  }
  render() {
    if (this.state.dead) return this.props.fallback ?? null;
    return this.props.children;
  }
}
