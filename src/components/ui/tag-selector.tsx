"use client";

import { useState } from "react";
import { Input } from "./input";
import { Badge } from "./badge";
import { X } from "lucide-react";

interface Tag {
  id: string;
  name: string;
}

interface TagSelectorProps {
  allTags: Tag[];
  selectedTags: string[];
  onTagSelect: (tagIds: string[]) => void;
  onCreateTag?: (name: string) => Promise<void>;
}

export function TagSelector({
  allTags,
  selectedTags,
  onTagSelect,
  onCreateTag
}: TagSelectorProps) {
  const [searchValue, setSearchValue] = useState("");

  // Lọc tags dựa trên search value
  const filteredTags = allTags.filter(tag => 
    tag.name.toLowerCase().includes(searchValue.toLowerCase()) &&
    !selectedTags.includes(tag.id)
  );

  // Các tags đã chọn
  const selectedTagObjects = allTags.filter(tag => 
    selectedTags.includes(tag.id)
  );

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      e.preventDefault();
      
      // Kiểm tra xem tag đã tồn tại chưa
      const existingTag = allTags.find(
        tag => tag.name.toLowerCase() === searchValue.toLowerCase()
      );

      if (existingTag) {
        // Nếu tag đã tồn tại và chưa được chọn, thêm vào selected
        if (!selectedTags.includes(existingTag.id)) {
          onTagSelect([...selectedTags, existingTag.id]);
        }
      } else if (onCreateTag) {
        // Nếu tag chưa tồn tại, tạo mới
        await onCreateTag(searchValue);
      }

      setSearchValue("");
    }
  };

  const handleTagClick = (tagId: string) => {
    onTagSelect([...selectedTags, tagId]);
    setSearchValue("");
  };

  const handleRemoveTag = (tagId: string) => {
    onTagSelect(selectedTags.filter(id => id !== tagId));
  };

  return (
    <div className="space-y-2">
      <Input
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search or create new tag (press Enter)"
      />

      {/* Hiển thị các tags đã chọn */}
      <div className="flex flex-wrap gap-2 mb-2">
        {selectedTagObjects.map(tag => (
          <Badge
            key={tag.id}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag.name}
            <X
              className="h-3 w-3 cursor-pointer"
              onClick={() => handleRemoveTag(tag.id)}
            />
          </Badge>
        ))}
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      {searchValue && filteredTags.length > 0 && (
        <div className="border rounded-md p-2 space-y-1">
          {filteredTags.map(tag => (
            <div
              key={tag.id}
              className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => handleTagClick(tag.id)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 