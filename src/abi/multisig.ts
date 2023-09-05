import {Abi, encodeCall, decodeResult} from "@subsquid/ink-abi"

export const metadata = {
  "source": {
    "hash": "0x666d9f46a96e595c8a26ddf51dd4eada8344b1f1872566d587883b604e606c97",
    "language": "ink! 4.2.0",
    "compiler": "rustc 1.69.0-nightly",
    "build_info": {
      "build_mode": "Release",
      "cargo_contract_version": "3.0.1",
      "rust_toolchain": "nightly-aarch64-unknown-linux-gnu",
      "wasm_opt_settings": {
        "keep_debug_symbols": false,
        "optimization_passes": "Z"
      }
    }
  },
  "contract": {
    "name": "multisig",
    "version": "0.1.0",
    "authors": [
      "0xLucca",
      "GabrielCamba"
    ]
  },
  "spec": {
    "constructors": [
      {
        "args": [
          {
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 3
            }
          },
          {
            "label": "owners_list",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          "Constructor that creates a multisig contract with a list of owners and a threshold",
          "The threshold is the minimum number of approvals required to execute a transaction",
          "All the representation invariant checks are performed in the constructor",
          "The list of owners is a list of account ids that can propose, approve or reject transactions",
          "The list of owners cannot be empty",
          "The owners cannot be duplicated",
          "The threshold cannot be greater than the number of owners",
          "The threshold cannot be zero",
          "The maximum number of owners is defined by MAX_OWNERS",
          "The maximum number of transactions is defined by MAX_TRANSACTIONS",
          "The transaction Id is a counter that starts at 0 and is incremented by 1 for each transaction",
          "The transaction Id cannot overflow"
        ],
        "label": "new",
        "payable": false,
        "returnType": {
          "displayName": [
            "ink_primitives",
            "ConstructorResult"
          ],
          "type": 10
        },
        "selector": "0x9bae9d5e"
      }
    ],
    "docs": [],
    "environment": {
      "accountId": {
        "displayName": [
          "AccountId"
        ],
        "type": 1
      },
      "balance": {
        "displayName": [
          "Balance"
        ],
        "type": 5
      },
      "blockNumber": {
        "displayName": [
          "BlockNumber"
        ],
        "type": 30
      },
      "chainExtension": {
        "displayName": [
          "ChainExtension"
        ],
        "type": 31
      },
      "hash": {
        "displayName": [
          "Hash"
        ],
        "type": 29
      },
      "maxEventTopics": 4,
      "timestamp": {
        "displayName": [
          "Timestamp"
        ],
        "type": 8
      }
    },
    "events": [
      {
        "args": [
          {
            "docs": [
              " The new threshold"
            ],
            "indexed": true,
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 3
            }
          }
        ],
        "docs": [
          "Emitted when the threshold is changed"
        ],
        "label": "ThresholdChanged"
      },
      {
        "args": [
          {
            "docs": [
              " New owner's account id"
            ],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [
          "Emmited when an owner is added"
        ],
        "label": "OwnerAdded"
      },
      {
        "args": [
          {
            "docs": [
              " Removed owner's account id"
            ],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [
          "Emmited when an owner is removed"
        ],
        "label": "OwnerRemoved"
      },
      {
        "args": [
          {
            "docs": [
              " Transaction id"
            ],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [
              " Contract address"
            ],
            "indexed": true,
            "label": "contract_address",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          },
          {
            "docs": [
              " Selector on the contract"
            ],
            "indexed": false,
            "label": "selector",
            "type": {
              "displayName": [],
              "type": 16
            }
          },
          {
            "docs": [
              " Input of the call"
            ],
            "indexed": false,
            "label": "input",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 7
            }
          },
          {
            "docs": [
              " Transferred value of the call"
            ],
            "indexed": false,
            "label": "transferred_value",
            "type": {
              "displayName": [
                "Balance"
              ],
              "type": 5
            }
          },
          {
            "docs": [
              " Gas limit of the call"
            ],
            "indexed": false,
            "label": "gas_limit",
            "type": {
              "displayName": [
                "u64"
              ],
              "type": 8
            }
          },
          {
            "docs": [
              " Allow reentry flag of the call"
            ],
            "indexed": false,
            "label": "allow_reentry",
            "type": {
              "displayName": [
                "bool"
              ],
              "type": 9
            }
          },
          {
            "docs": [
              " Address of the transaction proposer"
            ],
            "indexed": false,
            "label": "proposer",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [
          "Emmited when a transaction is proposed"
        ],
        "label": "TransactionProposed"
      },
      {
        "args": [
          {
            "docs": [
              " Transaction id"
            ],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [
              " approver's account id"
            ],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [
          "Emmited when a transaction is approved"
        ],
        "label": "Approve"
      },
      {
        "args": [
          {
            "docs": [
              " Transaction id"
            ],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [
              " rejecter's account id"
            ],
            "indexed": true,
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "docs": [
          "Emmited when a transaction is rejected"
        ],
        "label": "Reject"
      },
      {
        "args": [
          {
            "docs": [
              " Transaction id"
            ],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "docs": [
              " Result of the transaction execution"
            ],
            "indexed": false,
            "label": "result",
            "type": {
              "displayName": [
                "TxResult"
              ],
              "type": 28
            }
          }
        ],
        "docs": [
          "Emmited when a transaction is executed"
        ],
        "label": "TransactionExecuted"
      },
      {
        "args": [
          {
            "docs": [
              " Transaction id"
            ],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "docs": [
          "Emmited when a transaction is cancelled"
        ],
        "label": "TransactionCancelled"
      },
      {
        "args": [
          {
            "docs": [
              " Transaction id"
            ],
            "indexed": true,
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "docs": [
          "Emmited when a transaction is removed"
        ],
        "label": "TransactionRemoved"
      },
      {
        "args": [
          {
            "docs": [
              " Receiver's account id"
            ],
            "indexed": true,
            "label": "to",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          },
          {
            "docs": [
              " Amount of the transfer"
            ],
            "indexed": false,
            "label": "value",
            "type": {
              "displayName": [
                "Balance"
              ],
              "type": 5
            }
          }
        ],
        "docs": [
          "Emmited when a transfer is performed"
        ],
        "label": "Transfer"
      }
    ],
    "lang_error": {
      "displayName": [
        "ink",
        "LangError"
      ],
      "type": 14
    },
    "messages": [
      {
        "args": [
          {
            "label": "tx",
            "type": {
              "displayName": [
                "Transaction"
              ],
              "type": 15
            }
          }
        ],
        "default": false,
        "docs": [
          " Transaction proposal",
          " The parameters of the transaction are passed as a Transaction struct",
          " The caller of this function must be an owner",
          " The maximum number of transactions cannot be passed",
          " The transaction Id cannot overflow",
          " The transaction is stored in the contract",
          " The transaction is initialized with 1 approval and 0 rejections",
          " Emit TransactionProposed event"
        ],
        "label": "propose_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x0b1f1375"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Transaction approval",
          " The caller of this function must be an owner",
          " The parameter of the transaction is the transaction Id",
          " The transaction Id must be valid",
          " The caller must not have voted yet",
          " The transaction is approved",
          " Emit Approve event",
          " The transaction is executed if the threshold is met"
        ],
        "label": "approve_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x59f1ed0c"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Transaction rejection",
          " The caller of this function must be an owner",
          " The parameter of the transaction is the transaction Id",
          " The transaction Id must be valid",
          " The caller must not have voted yet",
          " The transaction is rejected",
          " Emit Reject event",
          " The transaction is removed if the threshold cannot be met with the remaining approvals"
        ],
        "label": "reject_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x08ac8825"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Transaction execution",
          " The transaction Id must be valid",
          " The parameter of the transaction is the transaction Id",
          " The threshold must be met in order to execute the transaction"
        ],
        "label": "try_execute_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0xd7c8d55f"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Transaction removal",
          " The transaction Id must be valid",
          " The parameter of the transaction is the transaction Id",
          " The threshold must not be met in order to remove the transaction"
        ],
        "label": "try_remove_tx",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x33f0fe58"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [
          " Owner addition",
          " The caller of this function must be the multisig contract itself",
          " The parameter of the transaction is the owner's account id",
          " Perform checking representation invariants",
          " The maximum number of owners cannot be reached",
          " The owner cannot be already an owner",
          " The owner is added",
          " Emit OwnerAdded event"
        ],
        "label": "add_owner",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0xad6d4358"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [
          " Owner removal",
          " The caller of this function must be the multisig contract itself",
          " The parameter of the transaction is the owner's account id",
          " Perform checking representation invariants",
          " The owners cannot be empty after removing",
          " The threshold cannot be greater than the number of owners after removing",
          " The owner is removed",
          " Emit OwnerRemoved event"
        ],
        "label": "remove_owner",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0xfdfe3353"
      },
      {
        "args": [
          {
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 3
            }
          }
        ],
        "default": false,
        "docs": [
          " Threshold change",
          " The caller of this function must be the multisig contract itself",
          " The parameter of the transaction is the new threshold",
          " Perform checking representation invariants",
          " The threshold cannot be greater than the number of owners",
          " The threshold cannot be zero",
          " The threshold is changed",
          " Emit ThresholdChanged event"
        ],
        "label": "change_threshold",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x1f154c5b"
      },
      {
        "args": [
          {
            "label": "to",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          },
          {
            "label": "value",
            "type": {
              "displayName": [
                "Balance"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Transfer funds from the contract to another account",
          " The caller of this function must be the multisig contract itself",
          " The parameter of the transaction is the receiver's account id and the amount to be transferred",
          " The transfer is performed",
          " Emit Transfer event"
        ],
        "label": "transfer",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x84a15da1"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          " Owners",
          " Get Owners",
          " The owners list is a list of account ids that can propose, approve or reject transactions"
        ],
        "label": "get_owners",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 17
        },
        "selector": "0x0b91ccc9"
      },
      {
        "args": [
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [
          " Is owner",
          " The parameter of the transaction is the owner's account id",
          " The owner is checked if it is an owner"
        ],
        "label": "is_owner",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 18
        },
        "selector": "0xd7a3fbb1"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          " Treshold",
          " Get Threshold",
          " The threshold is the current minimum number of approvals required to execute a transaction"
        ],
        "label": "get_threshold",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 19
        },
        "selector": "0x23122a1d"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          " Transactions",
          " Get Next Transaction Id",
          " Returns the next transaction id"
        ],
        "label": "get_next_tx_id",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 20
        },
        "selector": "0x95628e63"
      },
      {
        "args": [],
        "default": false,
        "docs": [
          " Get Active Transactions Id List",
          " Returns the list of active transactions"
        ],
        "label": "get_active_txid_list",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 21
        },
        "selector": "0x7c22b655"
      },
      {
        "args": [
          {
            "label": "index",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Get Transaction",
          " The parameter of the transaction is the transaction id",
          " Returns the transaction or None if the transaction id is not valid"
        ],
        "label": "get_tx",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 22
        },
        "selector": "0x00702515"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Is Transaction Valid",
          " The parameter of the transaction is the transaction id",
          " Returns a result with () if the transaction id is valid or an Error if it is not valid"
        ],
        "label": "is_tx_valid",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0x7aec7567"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Get Transaction Approvals",
          " The parameter of the transaction is the transaction id",
          " Returns the number of approvals for the transaction if the transaction id is valid or None if it is not valid"
        ],
        "label": "get_tx_approvals",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 24
        },
        "selector": "0x7818ec2a"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          }
        ],
        "default": false,
        "docs": [
          " Get Transaction Rejections",
          " The parameter of the transaction is the transaction id",
          " Returns the number of rejections for the transaction if the transaction id is valid or None if it is not valid"
        ],
        "label": "get_tx_rejections",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 24
        },
        "selector": "0xe6fca8b0"
      },
      {
        "args": [
          {
            "label": "tx_id",
            "type": {
              "displayName": [
                "TxId"
              ],
              "type": 5
            }
          },
          {
            "label": "owner",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 1
            }
          }
        ],
        "default": false,
        "docs": [
          " Get Transaction Approval For Account",
          " The parameters of the transaction are the transaction id and the account id",
          " Returns true if the account has approved the transaction, false if the account has rejected the transaction or None if the transaction id is not valid"
        ],
        "label": "get_tx_approval_for_account",
        "mutates": false,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 26
        },
        "selector": "0x0edbed0b"
      }
    ]
  },
  "storage": {
    "root": {
      "layout": {
        "struct": {
          "fields": [
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 0
                }
              },
              "name": "owners_list"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0xaee61b32",
                      "ty": 4
                    }
                  },
                  "root_key": "0xaee61b32"
                }
              },
              "name": "owners"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 3
                }
              },
              "name": "threshold"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 5
                }
              },
              "name": "next_tx_id"
            },
            {
              "layout": {
                "leaf": {
                  "key": "0x00000000",
                  "ty": 6
                }
              },
              "name": "txs_id_list"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "struct": {
                      "fields": [
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 1
                            }
                          },
                          "name": "address"
                        },
                        {
                          "layout": {
                            "array": {
                              "layout": {
                                "leaf": {
                                  "key": "0xbc330eb0",
                                  "ty": 3
                                }
                              },
                              "len": 4,
                              "offset": "0xbc330eb0"
                            }
                          },
                          "name": "selector"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 7
                            }
                          },
                          "name": "input"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 5
                            }
                          },
                          "name": "transferred_value"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 8
                            }
                          },
                          "name": "gas_limit"
                        },
                        {
                          "layout": {
                            "leaf": {
                              "key": "0xbc330eb0",
                              "ty": 9
                            }
                          },
                          "name": "allow_reentry"
                        }
                      ],
                      "name": "Transaction"
                    }
                  },
                  "root_key": "0xbc330eb0"
                }
              },
              "name": "txs"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0x0ce5b35d",
                      "ty": 9
                    }
                  },
                  "root_key": "0x0ce5b35d"
                }
              },
              "name": "approvals"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0x5876d092",
                      "ty": 3
                    }
                  },
                  "root_key": "0x5876d092"
                }
              },
              "name": "approvals_count"
            },
            {
              "layout": {
                "root": {
                  "layout": {
                    "leaf": {
                      "key": "0xbe6ca363",
                      "ty": 3
                    }
                  },
                  "root_key": "0xbe6ca363"
                }
              },
              "name": "rejections_count"
            }
          ],
          "name": "MultiSig"
        }
      },
      "root_key": "0x00000000"
    }
  },
  "types": [
    {
      "id": 0,
      "type": {
        "def": {
          "sequence": {
            "type": 1
          }
        }
      }
    },
    {
      "id": 1,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 2,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "AccountId"
        ]
      }
    },
    {
      "id": 2,
      "type": {
        "def": {
          "array": {
            "len": 32,
            "type": 3
          }
        }
      }
    },
    {
      "id": 3,
      "type": {
        "def": {
          "primitive": "u8"
        }
      }
    },
    {
      "id": 4,
      "type": {
        "def": {
          "tuple": []
        }
      }
    },
    {
      "id": 5,
      "type": {
        "def": {
          "primitive": "u128"
        }
      }
    },
    {
      "id": 6,
      "type": {
        "def": {
          "sequence": {
            "type": 5
          }
        }
      }
    },
    {
      "id": 7,
      "type": {
        "def": {
          "sequence": {
            "type": 3
          }
        }
      }
    },
    {
      "id": 8,
      "type": {
        "def": {
          "primitive": "u64"
        }
      }
    },
    {
      "id": 9,
      "type": {
        "def": {
          "primitive": "bool"
        }
      }
    },
    {
      "id": 10,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 11
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 11
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 11,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 4
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 12
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 4
          },
          {
            "name": "E",
            "type": 12
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 12,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 13,
                    "typeName": "String"
                  }
                ],
                "index": 0,
                "name": "EnvExecutionFailed"
              },
              {
                "fields": [
                  {
                    "type": 14,
                    "typeName": "LangError"
                  }
                ],
                "index": 1,
                "name": "LangExecutionFailed"
              },
              {
                "index": 2,
                "name": "OwnersCantBeEmpty"
              },
              {
                "index": 3,
                "name": "ThresholdGreaterThanOwners"
              },
              {
                "index": 4,
                "name": "ThresholdCantBeZero"
              },
              {
                "index": 5,
                "name": "Unauthorized"
              },
              {
                "index": 6,
                "name": "MaxOwnersReached"
              },
              {
                "index": 7,
                "name": "OwnerAlreadyExists"
              },
              {
                "index": 8,
                "name": "NotOwner"
              },
              {
                "index": 9,
                "name": "MaxTransactionsReached"
              },
              {
                "index": 10,
                "name": "TxIdOverflow"
              },
              {
                "index": 11,
                "name": "AlreadyVoted"
              },
              {
                "index": 12,
                "name": "InvalidTxId"
              },
              {
                "index": 13,
                "name": "TransferFailed"
              }
            ]
          }
        },
        "path": [
          "multisig",
          "multisig",
          "MultisigError"
        ]
      }
    },
    {
      "id": 13,
      "type": {
        "def": {
          "primitive": "str"
        }
      }
    },
    {
      "id": 14,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 1,
                "name": "CouldNotReadInput"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "LangError"
        ]
      }
    },
    {
      "id": 15,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "name": "address",
                "type": 1,
                "typeName": "AccountId"
              },
              {
                "name": "selector",
                "type": 16,
                "typeName": "[u8; 4]"
              },
              {
                "name": "input",
                "type": 7,
                "typeName": "Vec<u8>"
              },
              {
                "name": "transferred_value",
                "type": 5,
                "typeName": "Balance"
              },
              {
                "name": "gas_limit",
                "type": 8,
                "typeName": "u64"
              },
              {
                "name": "allow_reentry",
                "type": 9,
                "typeName": "bool"
              }
            ]
          }
        },
        "path": [
          "multisig",
          "multisig",
          "Transaction"
        ]
      }
    },
    {
      "id": 16,
      "type": {
        "def": {
          "array": {
            "len": 4,
            "type": 3
          }
        }
      }
    },
    {
      "id": 17,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 0
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 0
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 18,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 9
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 9
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 19,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 3
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 3
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 20,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 5
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 5
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 21,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 6
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 6
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 22,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 23
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 23
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 23,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "fields": [
                  {
                    "type": 15
                  }
                ],
                "index": 1,
                "name": "Some"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 15
          }
        ],
        "path": [
          "Option"
        ]
      }
    },
    {
      "id": 24,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 25
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 25
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 25,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "fields": [
                  {
                    "type": 3
                  }
                ],
                "index": 1,
                "name": "Some"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 3
          }
        ],
        "path": [
          "Option"
        ]
      }
    },
    {
      "id": 26,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 27
                  }
                ],
                "index": 0,
                "name": "Ok"
              },
              {
                "fields": [
                  {
                    "type": 14
                  }
                ],
                "index": 1,
                "name": "Err"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 27
          },
          {
            "name": "E",
            "type": 14
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 27,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "index": 0,
                "name": "None"
              },
              {
                "fields": [
                  {
                    "type": 9
                  }
                ],
                "index": 1,
                "name": "Some"
              }
            ]
          }
        },
        "params": [
          {
            "name": "T",
            "type": 9
          }
        ],
        "path": [
          "Option"
        ]
      }
    },
    {
      "id": 28,
      "type": {
        "def": {
          "variant": {
            "variants": [
              {
                "fields": [
                  {
                    "type": 7,
                    "typeName": "Vec<u8>"
                  }
                ],
                "index": 0,
                "name": "Success"
              },
              {
                "fields": [
                  {
                    "type": 12,
                    "typeName": "MultisigError"
                  }
                ],
                "index": 1,
                "name": "Failed"
              }
            ]
          }
        },
        "path": [
          "multisig",
          "multisig",
          "TxResult"
        ]
      }
    },
    {
      "id": 29,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 2,
                "typeName": "[u8; 32]"
              }
            ]
          }
        },
        "path": [
          "ink_primitives",
          "types",
          "Hash"
        ]
      }
    },
    {
      "id": 30,
      "type": {
        "def": {
          "primitive": "u32"
        }
      }
    },
    {
      "id": 31,
      "type": {
        "def": {
          "variant": {}
        },
        "path": [
          "ink_env",
          "types",
          "NoChainExtension"
        ]
      }
    }
  ],
  "version": "4"
}

const _abi = new Abi(metadata)

export function decodeEvent(hex: string): Event {
    return _abi.decodeEvent(hex)
}

export function decodeMessage(hex: string): Message {
    return _abi.decodeMessage(hex)
}

export function decodeConstructor(hex: string): Constructor {
    return _abi.decodeConstructor(hex)
}

export interface Chain {
    client: {
        call: <T=any>(method: string, params?: unknown[]) => Promise<T>
    }
}

export interface ChainContext {
    _chain: Chain
}

export class Contract {
    constructor(private ctx: ChainContext, private address: string, private blockHash?: string) { }

    get_owners(): Promise<Result<Vec, LangError>> {
        return this.stateCall('0x0b91ccc9', [])
    }

    is_owner(owner: AccountId): Promise<Result<bool, LangError>> {
        return this.stateCall('0xd7a3fbb1', [owner])
    }

    get_threshold(): Promise<Result<u8, LangError>> {
        return this.stateCall('0x23122a1d', [])
    }

    get_next_tx_id(): Promise<Result<bigint, LangError>> {
        return this.stateCall('0x95628e63', [])
    }

    get_active_txid_list(): Promise<Result<bigint[], LangError>> {
        return this.stateCall('0x7c22b655', [])
    }

    get_tx(index: bigint): Promise<Result<(Transaction | undefined), LangError>> {
        return this.stateCall('0x00702515', [index])
    }

    is_tx_valid(tx_id: bigint): Promise<Result<Type_11, LangError>> {
        return this.stateCall('0x7aec7567', [tx_id])
    }

    get_tx_approvals(tx_id: bigint): Promise<Result<(u8 | undefined), LangError>> {
        return this.stateCall('0x7818ec2a', [tx_id])
    }

    get_tx_rejections(tx_id: bigint): Promise<Result<(u8 | undefined), LangError>> {
        return this.stateCall('0xe6fca8b0', [tx_id])
    }

    get_tx_approval_for_account(tx_id: bigint, owner: AccountId): Promise<Result<(bool | undefined), LangError>> {
        return this.stateCall('0x0edbed0b', [tx_id, owner])
    }

    private async stateCall<T>(selector: string, args: any[]): Promise<T> {
        let input = _abi.encodeMessageInput(selector, args)
        let data = encodeCall(this.address, input)
        let result = await this.ctx._chain.client.call('state_call', ['ContractsApi_call', data, this.blockHash])
        let value = decodeResult(result)
        return _abi.decodeMessageOutput(selector, value)
    }
}

export type Event = Event_ThresholdChanged | Event_OwnerAdded | Event_OwnerRemoved | Event_TransactionProposed | Event_Approve | Event_Reject | Event_TransactionExecuted | Event_TransactionCancelled | Event_TransactionRemoved | Event_Transfer

export interface Event_ThresholdChanged {
    __kind: 'ThresholdChanged'
    /**
     *  The new threshold
     */
    threshold: u8
}

export interface Event_OwnerAdded {
    __kind: 'OwnerAdded'
    /**
     *  New owner's account id
     */
    owner: AccountId
}

export interface Event_OwnerRemoved {
    __kind: 'OwnerRemoved'
    /**
     *  Removed owner's account id
     */
    owner: AccountId
}

export interface Event_TransactionProposed {
    __kind: 'TransactionProposed'
    /**
     *  Transaction id
     */
    txId: bigint
    /**
     *  Contract address
     */
    contractAddress: AccountId
    /**
     *  Selector on the contract
     */
    selector: Uint8Array
    /**
     *  Input of the call
     */
    input: Uint8Array
    /**
     *  Transferred value of the call
     */
    transferredValue: bigint
    /**
     *  Gas limit of the call
     */
    gasLimit: u64
    /**
     *  Allow reentry flag of the call
     */
    allowReentry: bool
    /**
     *  Address of the transaction proposer
     */
    proposer: AccountId
}

export interface Event_Approve {
    __kind: 'Approve'
    /**
     *  Transaction id
     */
    txId: bigint
    /**
     *  approver's account id
     */
    owner: AccountId
}

export interface Event_Reject {
    __kind: 'Reject'
    /**
     *  Transaction id
     */
    txId: bigint
    /**
     *  rejecter's account id
     */
    owner: AccountId
}

export interface Event_TransactionExecuted {
    __kind: 'TransactionExecuted'
    /**
     *  Transaction id
     */
    txId: bigint
    /**
     *  Result of the transaction execution
     */
    result: TxResult
}

export interface Event_TransactionCancelled {
    __kind: 'TransactionCancelled'
    /**
     *  Transaction id
     */
    txId: bigint
}

export interface Event_TransactionRemoved {
    __kind: 'TransactionRemoved'
    /**
     *  Transaction id
     */
    txId: bigint
}

export interface Event_Transfer {
    __kind: 'Transfer'
    /**
     *  Receiver's account id
     */
    to: AccountId
    /**
     *  Amount of the transfer
     */
    value: bigint
}

export type Message = Message_propose_tx | Message_approve_tx | Message_reject_tx | Message_try_execute_tx | Message_try_remove_tx | Message_add_owner | Message_remove_owner | Message_change_threshold | Message_transfer | Message_get_owners | Message_is_owner | Message_get_threshold | Message_get_next_tx_id | Message_get_active_txid_list | Message_get_tx | Message_is_tx_valid | Message_get_tx_approvals | Message_get_tx_rejections | Message_get_tx_approval_for_account

/**
 *  Transaction proposal
 *  The parameters of the transaction are passed as a Transaction struct
 *  The caller of this function must be an owner
 *  The maximum number of transactions cannot be passed
 *  The transaction Id cannot overflow
 *  The transaction is stored in the contract
 *  The transaction is initialized with 1 approval and 0 rejections
 *  Emit TransactionProposed event
 */
export interface Message_propose_tx {
    __kind: 'propose_tx'
    tx: Transaction
}

/**
 *  Transaction approval
 *  The caller of this function must be an owner
 *  The parameter of the transaction is the transaction Id
 *  The transaction Id must be valid
 *  The caller must not have voted yet
 *  The transaction is approved
 *  Emit Approve event
 *  The transaction is executed if the threshold is met
 */
export interface Message_approve_tx {
    __kind: 'approve_tx'
    txId: bigint
}

/**
 *  Transaction rejection
 *  The caller of this function must be an owner
 *  The parameter of the transaction is the transaction Id
 *  The transaction Id must be valid
 *  The caller must not have voted yet
 *  The transaction is rejected
 *  Emit Reject event
 *  The transaction is removed if the threshold cannot be met with the remaining approvals
 */
export interface Message_reject_tx {
    __kind: 'reject_tx'
    txId: bigint
}

/**
 *  Transaction execution
 *  The transaction Id must be valid
 *  The parameter of the transaction is the transaction Id
 *  The threshold must be met in order to execute the transaction
 */
export interface Message_try_execute_tx {
    __kind: 'try_execute_tx'
    txId: bigint
}

/**
 *  Transaction removal
 *  The transaction Id must be valid
 *  The parameter of the transaction is the transaction Id
 *  The threshold must not be met in order to remove the transaction
 */
export interface Message_try_remove_tx {
    __kind: 'try_remove_tx'
    txId: bigint
}

/**
 *  Owner addition
 *  The caller of this function must be the multisig contract itself
 *  The parameter of the transaction is the owner's account id
 *  Perform checking representation invariants
 *  The maximum number of owners cannot be reached
 *  The owner cannot be already an owner
 *  The owner is added
 *  Emit OwnerAdded event
 */
export interface Message_add_owner {
    __kind: 'add_owner'
    owner: AccountId
}

/**
 *  Owner removal
 *  The caller of this function must be the multisig contract itself
 *  The parameter of the transaction is the owner's account id
 *  Perform checking representation invariants
 *  The owners cannot be empty after removing
 *  The threshold cannot be greater than the number of owners after removing
 *  The owner is removed
 *  Emit OwnerRemoved event
 */
export interface Message_remove_owner {
    __kind: 'remove_owner'
    owner: AccountId
}

/**
 *  Threshold change
 *  The caller of this function must be the multisig contract itself
 *  The parameter of the transaction is the new threshold
 *  Perform checking representation invariants
 *  The threshold cannot be greater than the number of owners
 *  The threshold cannot be zero
 *  The threshold is changed
 *  Emit ThresholdChanged event
 */
export interface Message_change_threshold {
    __kind: 'change_threshold'
    threshold: u8
}

/**
 *  Transfer funds from the contract to another account
 *  The caller of this function must be the multisig contract itself
 *  The parameter of the transaction is the receiver's account id and the amount to be transferred
 *  The transfer is performed
 *  Emit Transfer event
 */
export interface Message_transfer {
    __kind: 'transfer'
    to: AccountId
    value: bigint
}

/**
 *  Owners
 *  Get Owners
 *  The owners list is a list of account ids that can propose, approve or reject transactions
 */
export interface Message_get_owners {
    __kind: 'get_owners'
}

/**
 *  Is owner
 *  The parameter of the transaction is the owner's account id
 *  The owner is checked if it is an owner
 */
export interface Message_is_owner {
    __kind: 'is_owner'
    owner: AccountId
}

/**
 *  Treshold
 *  Get Threshold
 *  The threshold is the current minimum number of approvals required to execute a transaction
 */
export interface Message_get_threshold {
    __kind: 'get_threshold'
}

/**
 *  Transactions
 *  Get Next Transaction Id
 *  Returns the next transaction id
 */
export interface Message_get_next_tx_id {
    __kind: 'get_next_tx_id'
}

/**
 *  Get Active Transactions Id List
 *  Returns the list of active transactions
 */
export interface Message_get_active_txid_list {
    __kind: 'get_active_txid_list'
}

/**
 *  Get Transaction
 *  The parameter of the transaction is the transaction id
 *  Returns the transaction or None if the transaction id is not valid
 */
export interface Message_get_tx {
    __kind: 'get_tx'
    index: bigint
}

/**
 *  Is Transaction Valid
 *  The parameter of the transaction is the transaction id
 *  Returns a result with () if the transaction id is valid or an Error if it is not valid
 */
export interface Message_is_tx_valid {
    __kind: 'is_tx_valid'
    txId: bigint
}

/**
 *  Get Transaction Approvals
 *  The parameter of the transaction is the transaction id
 *  Returns the number of approvals for the transaction if the transaction id is valid or None if it is not valid
 */
export interface Message_get_tx_approvals {
    __kind: 'get_tx_approvals'
    txId: bigint
}

/**
 *  Get Transaction Rejections
 *  The parameter of the transaction is the transaction id
 *  Returns the number of rejections for the transaction if the transaction id is valid or None if it is not valid
 */
export interface Message_get_tx_rejections {
    __kind: 'get_tx_rejections'
    txId: bigint
}

/**
 *  Get Transaction Approval For Account
 *  The parameters of the transaction are the transaction id and the account id
 *  Returns true if the account has approved the transaction, false if the account has rejected the transaction or None if the transaction id is not valid
 */
export interface Message_get_tx_approval_for_account {
    __kind: 'get_tx_approval_for_account'
    txId: bigint
    owner: AccountId
}

export type Constructor = Constructor_new

/**
 * Constructor that creates a multisig contract with a list of owners and a threshold
 * The threshold is the minimum number of approvals required to execute a transaction
 * All the representation invariant checks are performed in the constructor
 * The list of owners is a list of account ids that can propose, approve or reject transactions
 * The list of owners cannot be empty
 * The owners cannot be duplicated
 * The threshold cannot be greater than the number of owners
 * The threshold cannot be zero
 * The maximum number of owners is defined by MAX_OWNERS
 * The maximum number of transactions is defined by MAX_TRANSACTIONS
 * The transaction Id is a counter that starts at 0 and is incremented by 1 for each transaction
 * The transaction Id cannot overflow
 */
export interface Constructor_new {
    __kind: 'new'
    threshold: u8
    ownersList: Vec
}

export type AccountId = Uint8Array

export type Vec = AccountId[]

export type LangError = LangError_CouldNotReadInput

export interface LangError_CouldNotReadInput {
    __kind: 'CouldNotReadInput'
}

export type bool = boolean

export type u8 = number

export interface Transaction {
    address: AccountId
    selector: Uint8Array
    input: Uint8Array
    transferredValue: bigint
    gasLimit: u64
    allowReentry: bool
}

export type Type_11 = Type_11_Ok | Type_11_Err

export interface Type_11_Ok {
    __kind: 'Ok'
}

export interface Type_11_Err {
    __kind: 'Err'
    value: MultisigError
}

export type u64 = bigint

export type TxResult = TxResult_Success | TxResult_Failed

export interface TxResult_Success {
    __kind: 'Success'
    value: Uint8Array
}

export interface TxResult_Failed {
    __kind: 'Failed'
    value: MultisigError
}

export type MultisigError = MultisigError_EnvExecutionFailed | MultisigError_LangExecutionFailed | MultisigError_OwnersCantBeEmpty | MultisigError_ThresholdGreaterThanOwners | MultisigError_ThresholdCantBeZero | MultisigError_Unauthorized | MultisigError_MaxOwnersReached | MultisigError_OwnerAlreadyExists | MultisigError_NotOwner | MultisigError_MaxTransactionsReached | MultisigError_TxIdOverflow | MultisigError_AlreadyVoted | MultisigError_InvalidTxId | MultisigError_TransferFailed

export interface MultisigError_EnvExecutionFailed {
    __kind: 'EnvExecutionFailed'
    value: string
}

export interface MultisigError_LangExecutionFailed {
    __kind: 'LangExecutionFailed'
    value: LangError
}

export interface MultisigError_OwnersCantBeEmpty {
    __kind: 'OwnersCantBeEmpty'
}

export interface MultisigError_ThresholdGreaterThanOwners {
    __kind: 'ThresholdGreaterThanOwners'
}

export interface MultisigError_ThresholdCantBeZero {
    __kind: 'ThresholdCantBeZero'
}

export interface MultisigError_Unauthorized {
    __kind: 'Unauthorized'
}

export interface MultisigError_MaxOwnersReached {
    __kind: 'MaxOwnersReached'
}

export interface MultisigError_OwnerAlreadyExists {
    __kind: 'OwnerAlreadyExists'
}

export interface MultisigError_NotOwner {
    __kind: 'NotOwner'
}

export interface MultisigError_MaxTransactionsReached {
    __kind: 'MaxTransactionsReached'
}

export interface MultisigError_TxIdOverflow {
    __kind: 'TxIdOverflow'
}

export interface MultisigError_AlreadyVoted {
    __kind: 'AlreadyVoted'
}

export interface MultisigError_InvalidTxId {
    __kind: 'InvalidTxId'
}

export interface MultisigError_TransferFailed {
    __kind: 'TransferFailed'
}

export type Result<T, E> = {__kind: 'Ok', value: T} | {__kind: 'Err', value: E}
