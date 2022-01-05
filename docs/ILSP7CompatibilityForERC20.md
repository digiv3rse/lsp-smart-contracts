# ILSP7CompatibilityForERC20







*LSP8 extension, for compatibility for clients / tools that expect ERC20.*

## Methods

### allowance

```solidity
function allowance(address tokenOwner, address operator) external nonpayable returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenOwner | address | undefined
| operator | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### approve

```solidity
function approve(address operator, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined
| amount | uint256 | undefined

### authorizeOperator

```solidity
function authorizeOperator(address operator, uint256 amount) external nonpayable
```



*Sets `amount` as the amount of tokens `operator` address has access to from callers tokens. See {isOperatorFor}. Requirements - `operator` cannot be calling address. - `operator` cannot be the zero address. Emits an {AuthorizedOperator} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined
| amount | uint256 | undefined

### balanceOf

```solidity
function balanceOf(address tokenOwner) external view returns (uint256)
```



*Returns the number of tokens owned by `tokenOwner`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| tokenOwner | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### decimals

```solidity
function decimals() external view returns (uint256)
```



*Returns the number of decimals used to get its user representation. NOTE: This information is only used for _display_ purposes: it in no way affects any of the arithmetic of the contract, including {balanceOf} and {transfer}.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### getData

```solidity
function getData(bytes32[] _keys) external view returns (bytes[])
```



*Gets array of data at multiple given `key`*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _keys | bytes32[] | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes[] | undefined

### isOperatorFor

```solidity
function isOperatorFor(address operator, address tokenOwner) external view returns (uint256)
```



*Returns amount of tokens `operator` address has access to from `tokenOwner`. Operators can send and burn tokens on behalf of their owners. The tokenOwner is their own operator.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined
| tokenOwner | address | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### revokeOperator

```solidity
function revokeOperator(address operator) external nonpayable
```



*Removes `operator` address as an operator of callers tokens. See {isOperatorFor}. Requirements - `operator` cannot be calling address. - `operator` cannot be the zero address. Emits a {RevokedOperator} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| operator | address | undefined

### setData

```solidity
function setData(bytes32[] _keys, bytes[] _values) external nonpayable
```



*Sets array of data at multiple given `key`. SHOULD only be callable by the owner of the contract set via ERC173. Emits a {DataChanged} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _keys | bytes32[] | undefined
| _values | bytes[] | undefined

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*Returns true if this contract implements the interface defined by `interfaceId`. See the corresponding https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section] to learn more about how these ids are created. This function call must use less than 30 000 gas.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```



*Returns the number of existing tokens.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined

### transfer

```solidity
function transfer(address to, uint256 amount) external nonpayable
```



*Transfers `amount` of tokens from `from` to `to`. The `force` parameter will be used when notifying the token sender and receiver. Requirements: - `from` cannot be the zero address. - `to` cannot be the zero address. - `amount` tokens must be owned by `from`. - If the caller is not `from`, it must be an operator for `from` with access to at least `amount` tokens. Emits a {Transfer} event.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| to | address | undefined
| amount | uint256 | undefined

### transferBatch

```solidity
function transferBatch(address[] from, address[] to, uint256[] amount, bool force, bytes[] data) external nonpayable
```



*Transfers many tokens based on the list `from`, `to`, `amount`. If any transfer fails the call will revert. Requirements: - `from`, `to`, `amount` lists are the same length. - no values in `from` can be the zero address. - no values in `to` can be the zero address. - each `amount` tokens must be owned by `from`. - If the caller is not `from`, it must be an operator for `from` with access to at least `amount` tokens. Emits {Transfer} events.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address[] | undefined
| to | address[] | undefined
| amount | uint256[] | undefined
| force | bool | undefined
| data | bytes[] | undefined

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from | address | undefined
| to | address | undefined
| amount | uint256 | undefined



## Events

### AuthorizedOperator

```solidity
event AuthorizedOperator(address indexed operator, address indexed tokenOwner, uint256 indexed amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| operator `indexed` | address | undefined |
| tokenOwner `indexed` | address | undefined |
| amount `indexed` | uint256 | undefined |

### DataChanged

```solidity
event DataChanged(bytes32 indexed key, bytes value)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| key `indexed` | bytes32 | undefined |
| value  | bytes | undefined |

### RevokedOperator

```solidity
event RevokedOperator(address indexed operator, address indexed tokenOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| operator `indexed` | address | undefined |
| tokenOwner `indexed` | address | undefined |

### Transfer

```solidity
event Transfer(address indexed operator, address indexed from, address indexed to, uint256 amount, bool force, bytes data)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| operator `indexed` | address | undefined |
| from `indexed` | address | undefined |
| to `indexed` | address | undefined |
| amount  | uint256 | undefined |
| force  | bool | undefined |
| data  | bytes | undefined |



