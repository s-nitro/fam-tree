import React from "react";
import type { Person } from "./FamilyTree";

type TreeNodeProps = {
  node: Person;
  onImageDrop: (id: string, imageUrl: string, isSpouse?: boolean) => void;
  addChild: (parentId: string) => void;
  addSpouse: (parentId: string) => void;
  removeNode: (parentId: string, childId: string, isSpouse?: boolean) => void;
  level?: number;
};

const levelColors = ["#f0f4ff", "#e6f0ff", "#d9e6ff"];

const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  onImageDrop,
  addChild,
  addSpouse,
  removeNode,
  level = 0,
}) => {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, isSpouse = false) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      onImageDrop(node.id, url, isSpouse);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const bgColor = levelColors[level % levelColors.length];
  const nodeSize = 90;
  const gap = 10;
  const minWidth = 200;
  const padding = 10;

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
          position: "relative",
        }}
      >
        {/* Main Person */}
        <div
          style={{
            width: nodeSize,
            height: nodeSize,
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
            position: "relative",
          }}
          onDrop={(e) => handleDrop(e)}
          onDragOver={handleDragOver}
        >
          {node.image ? (
            <img
              src={node.image}
              alt={node.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div>Drop You</div>
          )}
          <input
            type="file"
            accept="image/*"
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0,
              cursor: "pointer",
              top: 0,
              left: 0,
              zIndex: 2,
            }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImageDrop(node.id, URL.createObjectURL(file), false);
            }}
          />
          {/* Remove button for self */}
          {node.image && (
            <button
              onClick={() => onImageDrop(node.id, "", false)}
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
          )}
        </div>

        {/* Spouse */}
        {node.spouse && (
          <div
            style={{
              width: nodeSize,
              height: nodeSize,
              border: "2px dashed #e94a4a",
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
              position: "relative",
            }}
            onDrop={(e) => handleDrop(e, true)}
            onDragOver={handleDragOver}
          >
            {node.spouse.image ? (
              <img
                src={node.spouse.image}
                alt={node.spouse.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div>Drop Spouse</div>
            )}
            <input
              type="file"
              accept="image/*"
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0,
                cursor: "pointer",
                top: 0,
                left: 0,
                zIndex: 2,
              }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageDrop(node.id, URL.createObjectURL(file), true);
              }}
            />
            <button
              onClick={() => removeNode(node.id, node.spouse!.id, true)}
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
        )}
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
            <div
              key={child.id}
              style={{ flex: "0 0 auto", minWidth: 200, position: "relative" }}
            >
              <TreeNode
                node={child}
                onImageDrop={onImageDrop}
                addChild={addChild}
                addSpouse={addSpouse}
                removeNode={removeNode}
                level={level + 1}
              />
              {/* Remove child button */}
              <button
                onClick={() => removeNode(node.id, child.id)}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
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
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
