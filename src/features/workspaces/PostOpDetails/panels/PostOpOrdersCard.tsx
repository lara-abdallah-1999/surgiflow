import { FlaskConical,Image } from "lucide-react";
import { EmptyState,FollowUpRow,OrderForm,SmallAddButton,ViewAllButton,WorkspaceCard } from "../components";
import { type ExpandedList,type FollowUpOrder,type OrderStatus,type PostOpState } from "../types";

type Props = {
  postOp: PostOpState;
  setAddingOrder: import("react").Dispatch<import("react").SetStateAction<boolean>>;
  addingOrder: boolean;
  orderDraft: { type: FollowUpOrder["type"]; name: string; dueDate: string; };
  setOrderDraft: import("react").Dispatch<import("react").SetStateAction<{ type: FollowUpOrder["type"]; name: string; dueDate: string; }>>;
  addFollowUpOrder: () => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderResult: (id: string, result: string) => void;
  updateOrder: (id: string, nextItem: FollowUpOrder) => void;
  deleteOrder: (id: string) => void;
  setExpandedList: import("react").Dispatch<import("react").SetStateAction<ExpandedList>>;
};

export function PostOpOrdersCard({ postOp, setAddingOrder, addingOrder, orderDraft, setOrderDraft, addFollowUpOrder, updateOrderStatus, updateOrderResult, updateOrder, deleteOrder, setExpandedList }: Props) {
  return (<WorkspaceCard
                    title="Tests & Imaging"
                    subtitle="Requested investigations"
                    icon={
                      <FlaskConical
                        size={13}
                      />
                    }
                    tone="amber"
                    count={
                      postOp.followUps.length
                    }
                    action={
                      <SmallAddButton
                        onClick={() =>
                          setAddingOrder(
                            true,
                          )
                        }
                        label="Request"
                      />
                    }
                  >
                    <div className="flex h-full min-h-0 flex-col gap-1.5">
                      {addingOrder && (
                        <OrderForm
                          value={
                            orderDraft
                          }
                          onChange={
                            setOrderDraft
                          }
                          onCancel={() =>
                            setAddingOrder(
                              false,
                            )
                          }
                          onSave={
                            addFollowUpOrder
                          }
                        />
                      )}

                      {!addingOrder &&
                        postOp.followUps
                          .slice(0, 3)
                          .map((item) => (
                            <FollowUpRow
                              key={item.id}
                              item={item}
                              onStatusChange={(
                                status,
                              ) =>
                                updateOrderStatus(
                                  item.id,
                                  status,
                                )
                              }
                              onResultChange={(
                                result,
                              ) =>
                                updateOrderResult(
                                  item.id,
                                  result,
                                )
                              }
                              onEdit={(
                                nextItem,
                              ) =>
                                updateOrder(
                                  item.id,
                                  nextItem,
                                )
                              }
                              onDelete={() =>
                                deleteOrder(
                                  item.id,
                                )
                              }
                            />
                          ))}

                      {!addingOrder &&
                        postOp.followUps
                          .length ===
                          0 && (
                          <EmptyState
                            icon={
                              <Image
                                size={16}
                              />
                            }
                            text="No tests or imaging requested"
                          />
                        )}

                      {!addingOrder &&
                        postOp.followUps
                          .length > 3 && (
                          <ViewAllButton
                            count={
                              postOp.followUps
                                .length
                            }
                            label="requests"
                            onClick={() =>
                              setExpandedList(
                                "followUps",
                              )
                            }
                          />
                        )}
                    </div>
                  </WorkspaceCard>);
}
