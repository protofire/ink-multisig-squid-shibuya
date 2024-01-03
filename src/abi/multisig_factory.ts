import {Abi, Bytes, encodeCall, decodeResult} from "@subsquid/ink-abi"

export const metadata = {
  "source": {
    "hash": "0x0052c0c0070d444f20ce50f92eb4bd01ec20d5494acb2900c2bd4a5a43f71bec",
    "language": "ink! 4.2.1",
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
    "name": "multisig-factory",
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
            "label": "codehash",
            "type": {
              "displayName": [
                "Hash"
              ],
              "type": 0
            }
          }
        ],
        "default": false,
        "docs": [
          "Constructor that stores the codehash of the MultiSig contract."
        ],
        "label": "new",
        "payable": false,
        "returnType": {
          "displayName": [
            "ink_primitives",
            "ConstructorResult"
          ],
          "type": 3
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
        "type": 8
      },
      "balance": {
        "displayName": [
          "Balance"
        ],
        "type": 14
      },
      "blockNumber": {
        "displayName": [
          "BlockNumber"
        ],
        "type": 16
      },
      "chainExtension": {
        "displayName": [
          "ChainExtension"
        ],
        "type": 17
      },
      "hash": {
        "displayName": [
          "Hash"
        ],
        "type": 0
      },
      "maxEventTopics": 4,
      "timestamp": {
        "displayName": [
          "Timestamp"
        ],
        "type": 15
      }
    },
    "events": [
      {
        "args": [
          {
            "docs": [
              " The address of the deployed MultiSig contract."
            ],
            "indexed": true,
            "label": "multisig_address",
            "type": {
              "displayName": [
                "AccountId"
              ],
              "type": 8
            }
          },
          {
            "docs": [
              " The threshold of the deployed MultiSig contract."
            ],
            "indexed": false,
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 2
            }
          },
          {
            "docs": [
              " The list of owners of the deployed MultiSig contract."
            ],
            "indexed": false,
            "label": "owners_list",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 7
            }
          },
          {
            "docs": [
              " The salt used to deploy the MultiSig contract."
            ],
            "indexed": false,
            "label": "salt",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 9
            }
          }
        ],
        "docs": [
          "NewMultisig event emitted when a new MultiSig contract is deployed."
        ],
        "label": "NewMultisig"
      }
    ],
    "lang_error": {
      "displayName": [
        "ink",
        "LangError"
      ],
      "type": 6
    },
    "messages": [
      {
        "args": [
          {
            "label": "threshold",
            "type": {
              "displayName": [
                "u8"
              ],
              "type": 2
            }
          },
          {
            "label": "owners_list",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 7
            }
          },
          {
            "label": "salt",
            "type": {
              "displayName": [
                "Vec"
              ],
              "type": 9
            }
          }
        ],
        "default": false,
        "docs": [
          " Deploy a new MultiSig contract.",
          " The threshold and owners_list are passed as parameters.",
          " The salt is passed as a parameter.",
          " The multisig address is emitted as an event with the threshold and",
          " owners_list."
        ],
        "label": "new_multisig",
        "mutates": true,
        "payable": false,
        "returnType": {
          "displayName": [
            "ink",
            "MessageResult"
          ],
          "type": 10
        },
        "selector": "0xf72d4700"
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
              "name": "multisig_codehash"
            }
          ],
          "name": "MultiSigFactory"
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
          "composite": {
            "fields": [
              {
                "type": 1,
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
      "id": 1,
      "type": {
        "def": {
          "array": {
            "len": 32,
            "type": 2
          }
        }
      }
    },
    {
      "id": 2,
      "type": {
        "def": {
          "primitive": "u8"
        }
      }
    },
    {
      "id": 3,
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
                    "type": 6
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
            "type": 6
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 4,
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
                    "type": 5
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
            "type": 5
          }
        ],
        "path": [
          "Result"
        ]
      }
    },
    {
      "id": 5,
      "type": {
        "def": {
          "tuple": []
        }
      }
    },
    {
      "id": 6,
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
      "id": 7,
      "type": {
        "def": {
          "sequence": {
            "type": 8
          }
        }
      }
    },
    {
      "id": 8,
      "type": {
        "def": {
          "composite": {
            "fields": [
              {
                "type": 1,
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
      "id": 9,
      "type": {
        "def": {
          "sequence": {
            "type": 2
          }
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
                    "type": 6
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
            "type": 6
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
                    "type": 5
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
            "type": 5
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
                    "type": 6,
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
          "primitive": "u128"
        }
      }
    },
    {
      "id": 15,
      "type": {
        "def": {
          "primitive": "u64"
        }
      }
    },
    {
      "id": 16,
      "type": {
        "def": {
          "primitive": "u32"
        }
      }
    },
    {
      "id": 17,
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

export function decodeEvent(bytes: Bytes): Event {
    return _abi.decodeEvent(bytes)
}

export function decodeMessage(bytes: Bytes): Message {
    return _abi.decodeMessage(bytes)
}

export function decodeConstructor(bytes: Bytes): Constructor {
    return _abi.decodeConstructor(bytes)
}

export interface Chain {
    rpc: {
        call<T=any>(method: string, params?: unknown[]): Promise<T>
    }
}

export interface ChainContext {
    _chain: Chain
}

export class Contract {
    constructor(private ctx: ChainContext, private address: Bytes, private blockHash?: Bytes) { }

    private async stateCall<T>(selector: string, args: any[]): Promise<T> {
        let input = _abi.encodeMessageInput(selector, args)
        let data = encodeCall(this.address, input)
        let result = await this.ctx._chain.rpc.call('state_call', ['ContractsApi_call', data, this.blockHash])
        let value = decodeResult(result)
        return _abi.decodeMessageOutput(selector, value)
    }
}

export type Constructor = Constructor_new

/**
 * Constructor that stores the codehash of the MultiSig contract.
 */
export interface Constructor_new {
    __kind: 'new'
    codehash: Hash
}

export type Hash = Bytes

export type Message = Message_new_multisig

/**
 *  Deploy a new MultiSig contract.
 *  The threshold and owners_list are passed as parameters.
 *  The salt is passed as a parameter.
 *  The multisig address is emitted as an event with the threshold and
 *  owners_list.
 */
export interface Message_new_multisig {
    __kind: 'new_multisig'
    threshold: u8
    ownersList: AccountId[]
    salt: Vec
}

export type Vec = Bytes

export type AccountId = Bytes

export type u8 = number

export type Event = Event_NewMultisig

export interface Event_NewMultisig {
    __kind: 'NewMultisig'
    /**
     *  The address of the deployed MultiSig contract.
     */
    multisigAddress: AccountId
    /**
     *  The threshold of the deployed MultiSig contract.
     */
    threshold: u8
    /**
     *  The list of owners of the deployed MultiSig contract.
     */
    ownersList: AccountId[]
    /**
     *  The salt used to deploy the MultiSig contract.
     */
    salt: Vec
}

export type Result<T, E> = {__kind: 'Ok', value: T} | {__kind: 'Err', value: E}
