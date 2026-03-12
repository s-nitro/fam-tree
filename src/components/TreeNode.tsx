import React from "react";

type Person = {
  id: string;
  name: string;
  image?: string;
  spouse?: Person;
  children: Person[];
};

type TreeNodeProps = {
  node: Person;
  onImageDrop: (id: string, imageUrl: string, isSpouse?: boolean) => void;
  addChild: (parentId: string) => void;
  addSpouse: (parentId: string) => void;
  removeNode: (id: string, isSpouse?: boolean) => void;
  updateName: (id: string, name: string, isSpouse?: boolean) => void;
  level?: number;
};

const levelColors = ["#f0f4ff", "#e6f0ff", "#d9e6ff"];

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onImageDrop,
  addChild,
  addSpouse,
  removeNode,
  updateName,
  level = 0,
}) => {
  const nodeSize = 90;
  const gap = 10;
  const minWidth = 200;
  const padding = 10;
  const bgColor = levelColors[level % levelColors.length];

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    personId: string,
    isSpouse = false
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      onImageDrop(personId, url, isSpouse);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const renderNode = (person: Person, isSpouse = false) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: 5,
      }}
    >
      <div style={{ position: "relative", width: nodeSize, height: nodeSize }}>
        {/* Node Circle */}
        <div
          onDrop={(e) => handleDrop(e, person.id, isSpouse)}
          onDragOver={handleDragOver}
          style={{
            width: "100%",
            height: "100%",
            border: "2px dashed #4a90e2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            background: "#fff",
            color: "#888",
            fontWeight: 500,
            fontSize: "0.8rem",
            textAlign: "center",
            borderColor: isSpouse ? "#e94a4a" : "#4a90e2",
          }}
        >
          {person.image ? (
            <img
              src={person.image}
              alt={person.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div>{isSpouse ? "Drop Spouse" : "Drop You"}</div>
          )}
        </div>

        {/* File input overlay */}
        <input
          type="file"
          accept="image/*"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            zIndex: 2,
          }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const url = URL.createObjectURL(file);
              onImageDrop(person.id, url, isSpouse); // <- use person.id
            }
            e.target.value = "";
          }}
        />

        {/* Remove button */}
        <button
          onClick={() => removeNode(person.id, isSpouse)} // <- use person.id
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            zIndex: 3,
            background: "#e94a4a",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 20,
            height: 20,
            fontSize: 14,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
          }}
        >
          ×
        </button>
      </div>

      {/* Name input */}
      <input
        type="text"
        value={person.name}
        placeholder={isSpouse ? "Spouse Name" : "Name"}
        onChange={(e) => updateName(person.id, e.target.value, isSpouse)} // <- use person.id
        style={{
          width: 80,
          marginTop: 5,
          textAlign: "center",
          fontSize: "0.8rem",
        }}
      />
    </div>
  );

  return (
    <div style={{ margin: 10 }}>
      {/* Parent Box */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap,
          padding,
          borderRadius: 10,
          backgroundColor: bgColor,
          border: "1.5px solid #4a90e2",
          minWidth,
          flexWrap: "wrap",
        }}
      >
        {renderNode(node, false)}
        {node.spouse && renderNode(node.spouse, true)}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: 5 }}>
        <button
          onClick={() => addChild(node.id)}
          style={{ marginRight: 5, padding: "0.3em 0.6em", fontSize: "0.8rem" }}
        >
          Add Child
        </button>
        {!node.spouse && (
          <button
            onClick={() => addSpouse(node.id)}
            style={{ padding: "0.3em 0.6em", fontSize: "0.8rem" }}
          >
            Add Spouse
          </button>
        )}
      </div>

      {/* Children */}
      {node.children.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "nowrap",
            overflowX: "auto",
            gap: 20,
            marginTop: 20,
            padding: 10,
            border: "1.5px solid #ccc",
            borderRadius: 10,
          }}
        >
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onImageDrop={onImageDrop}
              addChild={addChild}
              addSpouse={addSpouse}
              removeNode={removeNode}
              updateName={updateName}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
