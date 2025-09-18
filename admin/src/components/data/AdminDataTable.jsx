import React, { useState } from "react";
import {
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
  Button,
  UserAvatar,
  Icon,
} from "@/components/Component";

// Generic reusable admin data table wrapper with selection and row actions
// Props:
// - data: array of items
// - columns: [{ title, key, size, render?: (item) => node }]
// - actions: [{ label, icon, color, onClick(item), disabled? }]
// - selectable: boolean
// - onBulkAction: (action, ids[]) => void
// - loading: boolean
// - rowKey?: string (defaults to 'id')
const AdminDataTable = ({
  data = [],
  columns = [],
  actions = [],
  selectable = false,
  onBulkAction,
  loading = false,
  rowKey = "id",
}) => {
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [bulkAction, setBulkAction] = useState("");

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedItems(new Set(data.map((i) => i[rowKey])));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelect = (id, checked) => {
    const next = new Set(selectedItems);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedItems(next);
  };

  const submitBulkAction = () => {
    if (bulkAction && selectedItems.size > 0) {
      onBulkAction?.(bulkAction, Array.from(selectedItems));
      setSelectedItems(new Set());
      setBulkAction("");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-data-table">
      {selectable && selectedItems.size > 0 && (
        <div className="bulk-actions mb-3 p-3 bg-light rounded">
          <div className="d-flex align-items-center">
            <span className="mr-3">{selectedItems.size} selected</span>
            <select
              className="form-select form-select-sm mr-2"
              style={{ width: "auto" }}
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">Bulk Actions</option>
              <option value="activate">Activate</option>
              <option value="deactivate">Deactivate</option>
              <option value="delete">Delete</option>
            </select>
            <Button size="sm" color="primary" onClick={submitBulkAction} disabled={!bulkAction}>
              Apply
            </Button>
          </div>
        </div>
      )}

      <DataTable>
        <DataTableBody>
          <DataTableHead>
            {selectable && (
              <DataTableRow>
                <div className="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="selectAll"
                    checked={selectedItems.size === data.length && data.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                  <label className="custom-control-label" htmlFor="selectAll"></label>
                </div>
              </DataTableRow>
            )}
            {columns.map((c, idx) => (
              <DataTableRow key={idx} size={c.size}>
                <span className="sub-text">{c.title}</span>
              </DataTableRow>
            ))}
            {actions.length > 0 && (
              <DataTableRow className="nk-tb-col-tools text-right">
                <span className="sub-text">Actions</span>
              </DataTableRow>
            )}
          </DataTableHead>

          {data.map((item, rowIdx) => (
            <DataTableItem key={item[rowKey] || rowIdx}>
              {selectable && (
                <DataTableRow>
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id={`select_${item[rowKey]}`}
                      checked={selectedItems.has(item[rowKey])}
                      onChange={(e) => handleSelect(item[rowKey], e.target.checked)}
                    />
                    <label className="custom-control-label" htmlFor={`select_${item[rowKey]}`}></label>
                  </div>
                </DataTableRow>
              )}

              {columns.map((c, colIdx) => (
                <DataTableRow key={colIdx} size={c.size}>
                  {c.render ? c.render(item) : item[c.key]}
                </DataTableRow>
              ))}

              {actions.length > 0 && (
                <DataTableRow className="nk-tb-col-tools">
                  <ul className="nk-tb-actions gx-1">
                    {actions.map((a, actionIdx) => (
                      <li key={actionIdx}>
                        <Button
                          size="sm"
                          color={a.color || "light"}
                          outline
                          onClick={() => a.onClick?.(item)}
                          disabled={a.disabled?.(item)}
                          title={a.title}
                        >
                          {a.icon && <em className={`icon ni ni-${a.icon}`}></em>}
                          {a.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </DataTableRow>
              )}
            </DataTableItem>
          ))}
        </DataTableBody>
      </DataTable>
    </div>
  );
};

export default AdminDataTable;




