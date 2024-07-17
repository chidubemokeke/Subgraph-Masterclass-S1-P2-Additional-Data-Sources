// Importing necessary types and classes from the @graphprotocol/graph-ts library
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

// Importing entity classes from the generated schema
import {
  ProposalCreated,
  VoteCast,
  ProposalCanceled,
  ProposalQueued,
  ProposalExecuted,
} from "../../generated/schema";

// Importing event classes from the generated CGovernance smart contract
import {
  ProposalCreated as ProposalCreatedEvent,
  VoteCast as VoteCastEvent,
  ProposalCanceled as ProposalCanceledEvent,
  ProposalQueued as ProposalQueuedEvent,
  ProposalExecuted as ProposalExecutedEvent,
} from "../../generated/CGovernance/CGovernance";

// Importing helper functions for converting data types
import {
  convertAddressesToBytesArray,
  convertValuesToBigIntArray,
  convertCallDataToBytesArray,
  convertStringsToStringsArray,
} from "./logic";

// Function to initialize a Proposal entity when a ProposalCreatedEvent is emitted
export function initializeProposal(
  event: ProposalCreatedEvent
): ProposalCreated {
  // Convert the proposal ID from the event to a string and load the Proposal entity
  let proposalId = event.params.id.toString();
  let proposal = ProposalCreated.load(proposalId);

  // If the Proposal entity doesn't exist, create a new one
  if (!proposal) {
    proposal = new ProposalCreated(proposalId);
  }

  // Set properties of the Proposal entity using event parameters
  proposal.creationId = event.params.id;
  proposal.proposer = event.params.proposer;
  proposal.targets = convertAddressesToBytesArray(event.params.targets);
  proposal.values = convertValuesToBigIntArray(event.params.values);
  proposal.signatures = convertStringsToStringsArray(event.params.signatures);
  proposal.calldatas = convertCallDataToBytesArray(event.params.calldatas);
  proposal.startBlock = event.params.startBlock;
  proposal.endBlock = event.params.endBlock;
  proposal.description = event.params.description;
  proposal.votesFor = BigInt.fromI32(0);
  proposal.votesAgainst = BigInt.fromI32(0);
  proposal.votesAbstain = BigInt.fromI32(0);
  proposal.uniqueVoters = new Array<Bytes>();

  // Return the initialized Proposal entity
  return proposal;
}

// Function to initialize a Proposal entity and handle VoteCast events
export function initializeProposalAndHandleVote(event: VoteCastEvent): void {
  // Load the Proposal entity using the proposal ID from the event
  let proposal = ProposalCreated.load(event.params.proposalId.toString());
  if (!proposal) {
    // If the Proposal entity doesn't exist, exit the function
    return;
  }

  // Get the address of the voter from the event
  let voterAddress = event.params.voter as Bytes;

  // If the voter is not already in the uniqueVoters array, add them
  if (!proposal.uniqueVoters.includes(voterAddress)) {
    proposal.uniqueVoters.push(voterAddress);
  }

  // Update vote counts based on the support value from the event
  let votes = event.params.votes;
  if (event.params.support == 0) {
    proposal.votesAgainst = proposal.votesAgainst.plus(votes);
  } else if (event.params.support == 1) {
    proposal.votesFor = proposal.votesFor.plus(votes);
  } else if (event.params.support == 2) {
    proposal.votesAbstain = proposal.votesAbstain.plus(votes);
  }

  // Save the updated Proposal entity
  proposal.save();

  // Create and save the VoteCast entity
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toHex();
  let voteCast = new VoteCast(id);
  voteCast.voter = voterAddress;
  voteCast.proposalId = event.params.proposalId;
  voteCast.support = event.params.support;
  voteCast.votes = votes;
  voteCast.reason = event.params.reason;
  voteCast.blockNumber = event.block.number;
  voteCast.blockTimestamp = event.block.timestamp;
  voteCast.transactionHash = event.transaction.hash;

  // Save the VoteCast entity
  voteCast.save();
}

// Function to create a ProposalCanceled entity when a ProposalCanceledEvent is emitted
export function createProposalCanceled(
  event: ProposalCanceledEvent
): ProposalCanceled {
  // Create a unique ID using the transaction hash and log index
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();

  // Create and initialize the ProposalCanceled entity
  let canceled = new ProposalCanceled(id);
  canceled.cancelId = event.params.id;
  canceled.blockNumber = event.block.number;
  canceled.blockTimestamp = event.block.timestamp;
  canceled.transactionHash = event.transaction.hash;

  // Return the initialized ProposalCanceled entity
  return canceled;
}

// Function to create and save a ProposalQueued entity when a ProposalQueuedEvent is emitted
export function createProposalQueued(event: ProposalQueuedEvent): void {
  // Convert the proposal ID from the event to a string and load the ProposalQueued entity
  let proposalId = event.params.id.toString();
  let proposal = ProposalQueued.load(proposalId);

  // If the ProposalQueued entity doesn't exist, create a new one
  if (!proposal) {
    proposal = new ProposalQueued(proposalId);
  }

  // Set properties of the ProposalQueued entity using event parameters
  proposal.queueId = event.params.id;
  proposal.eta = event.params.eta;
  proposal.blockNumber = event.block.number;
  proposal.blockTimestamp = event.block.timestamp;
  proposal.transactionHash = event.transaction.hash;

  // Save the ProposalQueued entity
  proposal.save();
}

// Function to create and save a ProposalExecuted entity when a ProposalExecutedEvent is emitted
export function createProposalExecuted(event: ProposalExecutedEvent): void {
  // Convert the proposal ID from the event to a string and load the ProposalExecuted entity
  let proposalId = event.params.id.toString();
  let proposal = ProposalExecuted.load(proposalId);

  // If the ProposalExecuted entity doesn't exist, create a new one
  if (!proposal) {
    proposal = new ProposalExecuted(proposalId);
  }

  // Set properties of the ProposalExecuted entity using event parameters
  proposal.executionId = event.params.id;
  proposal.blockNumber = event.block.number;
  proposal.blockTimestamp = event.block.timestamp;
  proposal.transactionHash = event.transaction.hash;

  // Save the ProposalExecuted entity
  proposal.save();
}