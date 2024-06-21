export function createRoot() {
    let root = document.getElementById("root")!;

    if (!root) {
        root = document.createElement("div");
        root.id = "root";
        document.append(root);
    }

    return root;
}