import React, { useState } from "react";
import TreeNode from "./TreeNode";

export type Person = {
  id: string;
  name: string;
  image?: string;
  spouse?: Person | null;
  children: Person[];
};

const FamilyTree: React.FC = () => {
  const [tree, setTree] = useState<Person>({
    id: "root",
    name: "You",
    children: [],
  });

  const addChild = (parentId: string) => {
    setTree((prev) => {
      const addRecursive = (node: Person): Person => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [
              ...node.children,
              { id: `${parentId}-${Date.now()}`, name: "Child", children: [] },
            ],
          };
        }
        return {
          ...node,
          children: node.children.map(addRecursive),
          spouse: node.spouse ? addRecursive(node.spouse) : node.spouse,
        };
      };
      return addRecursive(prev);
    });
  };

  const addSpouse = (parentId: string) => {
    setTree((prev) => {
      const addRecursive = (node: Person): Person => {
        if (node.id === parentId && !node.spouse) {
          return {
            ...node,
            spouse: { id: `${parentId}-spouse`, name: "Spouse", children: [] },
          };
        }
        return {
          ...node,
          children: node.children.map(addRecursive),
          spouse: node.spouse ? addRecursive(node.spouse) : node.spouse,
        };
      };
      return addRecursive(prev);
    });
  };

  const onImageDrop = (id: string, imageUrl: string, isSpouse = false) => {
    const updateNode = (node: Person): Person => {
      if (node.id === id) {
        if (isSpouse && node.spouse) {
          return { ...node, spouse: { ...node.spouse, image: imageUrl } };
        }
        return { ...node, image: imageUrl };
      }
      return {
        ...node,
        children: node.children.map(updateNode),
        spouse: node.spouse ? updateNode(node.spouse) : node.spouse,
      };
    };
    setTree((prev) => updateNode(prev));
  };

  const removeNode = (parentId: string, childId: string, isSpouse = false) => {
    const removeRecursive = (node: Person) => {
      if (node.id === parentId) {
        if (isSpouse) {
          node.spouse = null;
        } else {
          node.children = node.children.filter((c) => c.id !== childId);
        }
      } else {
        node.children.forEach(removeRecursive);
        if (node.spouse) removeRecursive(node.spouse);
      }
    };

    setTree((prev) => {
      const copy = { ...prev };
      removeRecursive(copy);
      return { ...copy };
    });
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <TreeNode
        node={tree}
        onImageDrop={onImageDrop}
        addChild={addChild}
        addSpouse={addSpouse}
        removeNode={removeNode}
      />
    </div>
  );
};

export default FamilyTree;
