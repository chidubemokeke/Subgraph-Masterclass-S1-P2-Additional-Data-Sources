// Importing necessary types and classes from the @graphprotocol/graph-ts library
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import { DAO } from "../../generated/schema";

// Function to get or create a DAO entity and return it
export function getOrCreateDAO(id: Bytes): DAO {
  // Load DAO entity from the graph datastore using its ID
  let dao = DAO.load(id.toHexString());

  // If DAO entity doesn't exist, create a new one
  if (!dao) {
    dao = new DAO(id.toHexString()); // Instantiate new DAO entity with the provided ID
    dao.totalProposals = BigInt.fromI32(0); // Initialize totalProposals count as BigInt 0
    dao.totalVotesCast = BigInt.fromI32(0); // Initialize totalVotesCast count as BigInt 0
    dao.totalDelegatedVotesReceived = BigInt.fromI32(0); // Initialize totalDelegatedVotesReceived count as BigInt 0
    dao.totalDelegatedVotesGiven = BigInt.fromI32(0); // Initialize totalDelegatedVotesGiven count as BigInt 0
    dao.save(); // Save the newly created DAO entity to the graph datastore
  }

  // Return the DAO entity (either loaded or newly created)
  return dao as DAO;
}

// Convert integer 1 to BigInt
let increment = BigInt.fromI32(1);

// Function to increment proposal count
export function incrementProposalCount(dao: DAO): void {
  dao.totalProposals = dao.totalProposals.plus(increment); // Increment totalProposals count by 1
  dao.save(); // Save the updated DAO entity to the graph datastore
}

// Function to increment vote count
export function incrementVoteCount(dao: DAO): void {
  dao.totalVotesCast = dao.totalVotesCast.plus(increment); // Increment totalVotesCast count by 1
  dao.save(); // Save the updated DAO entity to the graph datastore
}

// Function to decrement proposal count
export function decrementProposalCount(dao: DAO): void {
  dao.totalProposals = dao.totalProposals.minus(increment); // Decrement totalProposals count by 1
  dao.save(); // Save the updated DAO entity to the graph datastore
}

// Convert the targets array (Address[]) from the event to an array of Bytes[]
export function convertAddressesToBytesArray(addresses: Address[]): Bytes[] {
  // Initialize an empty array to hold the converted Bytes objects
  let bytesArray: Bytes[] = [];

  // Loop through each Address in the input array
  for (let i = 0; i < addresses.length; i++) {
    // Convert the Address to a hex string, then to a Bytes object, and add it to the bytesArray
    bytesArray.push(Bytes.fromHexString(addresses[i].toHexString()));
  }

  // Return the array of Bytes objects
  return bytesArray;
}

// Function to return an array of BigInt objects as is
export function convertValuesToBigIntArray(values: BigInt[]): BigInt[] {
  // Directly return the input array without any modification
  return values; // No need to convert, just return the array as is
}

// Convert the calldatas array (Bytes[]) from the event to an array of Bytes[]
export function convertCallDataToBytesArray(values: Bytes[]): Bytes[] {
  // Initialize an empty array to hold the Bytes objects
  let calldatasBytes: Bytes[] = [];

  // Loop through each Bytes object in the input array
  for (let i = 0; i < values.length; i++) {
    // Add each Bytes object to the calldatasBytes array
    calldatasBytes.push(values[i]);
  }

  // Return the array of Bytes objects
  return calldatasBytes;
}

// Convert the signature array (Strings[]) from the event to an array of Strings[]
export function convertStringsToStringsArray(strings: string[]): string[] {
  // Initialize an empty array to hold the strings
  let stringsArray: string[] = [];

  // Loop through each string in the input array
  for (let i = 0; i < strings.length; i++) {
    // Add each string to the stringsArray
    stringsArray.push(strings[i]);
  }

  // Return the array of strings
  return stringsArray;
}
