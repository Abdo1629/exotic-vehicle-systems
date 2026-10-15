import type * as React from "react";

declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      "camera-controls"?: boolean;
      "auto-rotate"?: boolean;
      "rotation-per-second"?: string;
      "interaction-prompt"?: string;
      "shadow-intensity"?: string | number;
      exposure?: string | number;
      "environment-image"?: string;
      loading?: string;
      ar?: boolean;
      ref?: React.Ref<HTMLElement>;
    };
  }
}
