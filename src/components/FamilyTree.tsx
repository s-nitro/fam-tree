import React, { useState } from "react";
import TreeNode from "./TreeNode";
import { v4 as uuidv4 } from "uuid";

type Person = {
  id: string;
  name: string;
  image?: string;
  spouse?: Person;
  children: Person[];
};

const FamilyTree: React.FC = () => {
  const [tree, setTree] = useState<Person>({
    id: "root",
    name: "You",
    children: [],
  });

  // Helper to update node at any depth
  const updateNode = (
    node: Person,
    id: string,
    callback: (n: Person) => Person
  ): Person => {
    if (node.id === id) return callback(node);
    const newChildren = node.children.map((c) => updateNode(c, id, callback));
    const newSpouse = node.spouse
      ? updateNode(node.spouse, id, callback)
      : undefined;
    return { ...node, children: newChildren, spouse: newSpouse };
  };

  const onImageDrop = (id: string, url: string, isSpouse?: boolean) => {
    setTree((prev) =>
      updateNode(prev, id, (n) => {
        if (isSpouse)
          return {
            ...n,
            spouse: {
              ...(n.spouse || { id: uuidv4(), name: "Spouse", children: [] }),
              image: url,
            },
          };
        return { ...n, image: url };
      })
    );
  };

  const addChild = (parentId: string) => {
    setTree((prev) =>
      updateNode(prev, parentId, (n) => ({
        ...n,
        children: [
          ...n.children,
          { id: uuidv4(), name: "Child", children: [] },
        ],
      }))
    );
  };

  const addSpouse = (parentId: string) => {
    setTree((prev) =>
      updateNode(prev, parentId, (n) => ({
        ...n,
        spouse: { id: uuidv4(), name: "Spouse", children: [] },
      }))
    );
  };

  const removeNode = (id: string, isSpouse?: boolean) => {
    if (tree.id === id && !isSpouse) {
      setTree({ id: "root", name: "You", children: [] });
      return;
    }

    const removeFromNode = (node: Person): Person => {
      let newChildren = node.children
        .filter((c) => c.id !== id)
        .map(removeFromNode);
      let newSpouse = node.spouse;
      if (node.spouse && node.spouse.id === id) newSpouse = undefined;
      else if (node.spouse) newSpouse = removeFromNode(node.spouse);
      return { ...node, children: newChildren, spouse: newSpouse };
    };

    setTree(removeFromNode(tree));
  };

  const updateName = (id: string, name: string, isSpouse?: boolean) => {
    setTree((prev) =>
      updateNode(prev, id, (n) => {
        if (isSpouse)
          return {
            ...n,
            spouse: {
              ...(n.spouse || { id: uuidv4(), name: "Spouse", children: [] }),
              name,
            },
          };
        return { ...n, name };
      })
    );
  };

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <TreeNode
        node={tree}
        onImageDrop={onImageDrop}
        addChild={addChild}
        addSpouse={addSpouse}
        removeNode={removeNode}
        updateName={updateName}
      />
    </div>
  );
};

export default FamilyTree;
