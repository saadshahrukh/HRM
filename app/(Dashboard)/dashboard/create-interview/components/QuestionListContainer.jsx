import React, { useState } from 'react'

const QuestionListContainer = ({questions}) => {
 const [editIndex, setEditIndex] = useState(false)
    `1qa`
  return (
    <div><div className="mt-4">
              <h2 className="font-bold text-lg mb-2">Interview Questions</h2>
              <ul className="space-y-3">
                {questions.map((q, i) => (
                  <li
                    key={i}
                    className="p-3 border rounded-lg bg-white shadow-sm flex flex-col gap-2"
                  >
                    {editIndex === i ? (
                      <>
                        <input
                          type="text"
                          value={editData.question}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              question: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                        <input
                          type="text"
                          value={editData.type}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="border p-2 rounded"
                        />
                        <button
                          onClick={() => handleSaveClick(i)}
                          className="bg-green-500 text-white px-3 py-1 rounded flex items-center gap-1 w-fit"
                        >
                          <Save size={16} /> Save
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-900">
                          <strong>Question:</strong> {q.question}
                        </p>
                        <p className="text-sm text-blue-500">
                          <strong>Type:</strong> {q.type}
                        </p>
                        <button
                          onClick={() => handleEditClick(i)}
                          className="text-gray-500 hover:text-blue-500 flex items-center gap-1 w-fit"
                        >
                          <Pencil size={16} /> Edit
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div></div>
  )
}

export default QuestionListContainer