import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "@/lib/theme";

export default function PythonEditor({
  value,
  onChange,
  height = "340px",
}: {
  value: string;
  onChange: (v: string) => void;
  height?: string;
}) {
  const { theme } = useTheme();
  return (
    <CodeMirror
      value={value}
      height={height}
      theme={theme === "dark" ? oneDark : "light"}
      extensions={[python()]}
      onChange={onChange}
      basicSetup={{ lineNumbers: true, highlightActiveLine: true, foldGutter: false, autocompletion: true }}
    />
  );
}
