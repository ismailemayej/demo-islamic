"use client";

import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableListProps<T> {
  items: T[];
  getId: (item: T) => string;
  onChange: (newItems: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function DraggableList<T>({
  items,
  getId,
  onChange,
  renderItem,
  className = "",
}: DraggableListProps<T>) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => getId(item) === active.id);
      const newIndex = items.findIndex((item) => getId(item) === over?.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onChange(newItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => getId(item))}
        strategy={verticalListSortingStrategy}
      >
        <div className={`flex flex-col gap-3 ${className}`}>
          {items.map((item, index) => (
            <SortableItem key={getId(item)} id={getId(item)}>
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move active:opacity-80"
    >
      {children}
    </div>
  );
}
