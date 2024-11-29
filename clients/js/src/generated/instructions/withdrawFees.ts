/**
 * This code was AUTOGENERATED using the kinobi library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun kinobi to update it.
 *
 * @see https://github.com/metaplex-foundation/kinobi
 */

import { Context, Pda, PublicKey, Signer, TransactionBuilder, transactionBuilder } from '@metaplex-foundation/umi';
import { Serializer, array, mapSerializer, struct, u8 } from '@metaplex-foundation/umi/serializers';
import { ResolvedAccount, ResolvedAccountsWithIndices, getAccountMetasAndSigners } from '../shared';

// Accounts.
export type WithdrawFeesInstructionAccounts = {
    authority?: Signer;
    global: PublicKey | Pda;
    feeVault: PublicKey | Pda;
    mint: PublicKey | Pda;
    systemProgram?: PublicKey | Pda;
    tokenProgram?: PublicKey | Pda;
    clock: PublicKey | Pda;
    eventAuthority: PublicKey | Pda;
    program: PublicKey | Pda;
};

  // Data.
  export type WithdrawFeesInstructionData = { discriminator: Array<number>;  };

export type WithdrawFeesInstructionDataArgs = {  };


  export function getWithdrawFeesInstructionDataSerializer(): Serializer<WithdrawFeesInstructionDataArgs, WithdrawFeesInstructionData> {
  return mapSerializer<WithdrawFeesInstructionDataArgs, any, WithdrawFeesInstructionData>(struct<WithdrawFeesInstructionData>([['discriminator', array(u8(), { size: 8 })]], { description: 'WithdrawFeesInstructionData' }), (value) => ({ ...value, discriminator: [198, 212, 171, 109, 144, 215, 174, 89] }) ) as Serializer<WithdrawFeesInstructionDataArgs, WithdrawFeesInstructionData>;
}




// Instruction.
export function withdrawFees(
  context: Pick<Context, "identity" | "programs">,
                        input: WithdrawFeesInstructionAccounts,
      ): TransactionBuilder {
  // Program ID.
  const programId = context.programs.getPublicKey('pumpFun', 'DkgjYaaXrunwvqWT3JmJb29BMbmet7mWUifQeMQLSEQH');

  // Accounts.
  const resolvedAccounts = {
          authority: { index: 0, isWritable: true as boolean, value: input.authority ?? null },
          global: { index: 1, isWritable: false as boolean, value: input.global ?? null },
          feeVault: { index: 2, isWritable: false as boolean, value: input.feeVault ?? null },
          mint: { index: 3, isWritable: false as boolean, value: input.mint ?? null },
          systemProgram: { index: 4, isWritable: false as boolean, value: input.systemProgram ?? null },
          tokenProgram: { index: 5, isWritable: false as boolean, value: input.tokenProgram ?? null },
          clock: { index: 6, isWritable: false as boolean, value: input.clock ?? null },
          eventAuthority: { index: 7, isWritable: false as boolean, value: input.eventAuthority ?? null },
          program: { index: 8, isWritable: false as boolean, value: input.program ?? null },
      } satisfies ResolvedAccountsWithIndices;

  
    // Default values.
  if (!resolvedAccounts.authority.value) {
        resolvedAccounts.authority.value = context.identity;
      }
      if (!resolvedAccounts.systemProgram.value) {
        resolvedAccounts.systemProgram.value = context.programs.getPublicKey('splSystem', '11111111111111111111111111111111');
resolvedAccounts.systemProgram.isWritable = false
      }
      if (!resolvedAccounts.tokenProgram.value) {
        resolvedAccounts.tokenProgram.value = context.programs.getPublicKey('splToken', 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
resolvedAccounts.tokenProgram.isWritable = false
      }
      
  // Accounts in order.
      const orderedAccounts: ResolvedAccount[] = Object.values(resolvedAccounts).sort((a,b) => a.index - b.index);
  
  
  // Keys and Signers.
  const [keys, signers] = getAccountMetasAndSigners(orderedAccounts, "programId", programId);

  // Data.
      const data = getWithdrawFeesInstructionDataSerializer().serialize({});
  
  // Bytes Created On Chain.
      const bytesCreatedOnChain = 0;
  
  return transactionBuilder([{ instruction: { keys, programId, data }, signers, bytesCreatedOnChain }]);
}
